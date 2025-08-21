import { NextRequest, NextResponse } from "next/server";
import { requireUser, dayIndexFrom } from "@/lib/api/utils";
// import { retrieveContextDB } from "@/rag/retriever_db"; // Temporarily disabled
import { retrieveContext } from "@/rag/retriever"; // Fallback RAG retriever
import { generateLesson } from "@/lib/aiCall";
import { buildAdvancedLessonPrompt } from "@/lib/prompts";
import { logCall } from "@/lib/aiGuard"; // Re-enabled for AI call tracking

const LIMIT_WINDOW_MS = 5_000; // Reduced from 60 seconds to 5 seconds for better UX
declare global {
  var __todayRate: Map<string, number> | undefined;
}
function rateKey(userId: string, goalId: string) {
  return `${userId}:${goalId}`;
}
function checkRate(userId: string, goalId: string) {
  if (!globalThis.__todayRate) globalThis.__todayRate = new Map();
  const key = rateKey(userId, goalId);
  const now = Date.now();
  const last = globalThis.__todayRate.get(key) || 0;
  const delta = now - last;
  if (delta < LIMIT_WINDOW_MS) {
    return { ok: false, retry_ms: LIMIT_WINDOW_MS - delta };
  }
  globalThis.__todayRate.set(key, now);
  return { ok: true, retry_ms: 0 };
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user, supabase, res } = await requireUser(req);
    if (!user) return res!;
    const { id: goalId } = await params;

    const limit = checkRate(user.id, goalId);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many requests. Try again soon.", retry_ms: limit.retry_ms },
        { status: 429 }
      );
    }

    // Load goal & its plan_template link
    const { data: goal, error: gErr } = await supabase
      .from("learning_goals")
      .select("id, topic, focus, level, created_at, plan_template_id")
      .eq("id", goalId)
      .eq("user_id", user.id)
      .single();
    if (gErr || !goal) return NextResponse.json({ error: "Goal not found" }, { status: 404 });

    const dayIndex = dayIndexFrom(goal.created_at || new Date().toISOString());

    // If we have a template, try to reuse lesson
    if (goal.plan_template_id) {
      try {
        const { data: cached } = await supabase
          .from("lesson_template")
          .select("lesson_json")
          .eq("plan_template_id", goal.plan_template_id)
          .eq("day_index", dayIndex)
          .eq("version", 1)
          .maybeSingle();

        if (cached?.lesson_json) {
          console.log("Using cached lesson template");
          return NextResponse.json({ reused: true, lesson: cached.lesson_json });
        }
      } catch (error) {
        console.log("Template lookup failed, proceeding with generation:", error);
      }
    }

    // Check for existing user-specific lesson (fallback)
    try {
      const { data: existing } = await supabase
        .from("lesson_log")
        .select("id, lesson_json")
        .eq("user_id", user.id).eq("goal_id", goalId).eq("day_index", dayIndex)
        .maybeSingle();
      if (existing?.lesson_json) {
        console.log("Using cached user lesson");
        return NextResponse.json({ reused: false, lesson: existing.lesson_json });
      }
    } catch (error) {
      console.log("Lesson log lookup failed, proceeding with generation:", error);
    }

    // Generate new lesson with RAG
    const t0 = Date.now();
    
    // Check budget caps before AI call
    // Temporarily disabled while setting up database migrations
    // await checkCapsOrThrow(user.id, "lesson");
    
    // Create a more focused query for better context retrieval
    const userLevel = goal.level || 'beginner';
    const focusQuery = goal.focus ? 
      `${goal.topic} — focus: ${goal.focus} (level: ${userLevel}, day ${dayIndex})` :
      `${goal.topic} fundamentals (level: ${userLevel}, day ${dayIndex})`;

    // Retrieve a small, high-signal RAG context to minimize tokens
    const { context } = await retrieveContext(focusQuery, 3, goal.topic);
    
    // Build a more specific lesson prompt with level information
    const lessonFocus = goal.focus || `basic ${goal.topic} concepts`;
    const msgs = buildAdvancedLessonPrompt(context, goal.topic, lessonFocus, dayIndex, userLevel);
    
    try {
      const { data: lesson, usage: _usage } = await generateLesson(msgs, user.id, goalId);
      
      // Validate the lesson quality
      if (!lesson || !lesson.topic || !lesson.reading || !lesson.walkthrough) {
        console.error("Generated lesson is incomplete:", lesson);
        throw new Error("Failed to generate complete lesson");
      }
      
      // Ensure the lesson is focused and practical
      if (lesson.topic.length < 10 || lesson.reading.length < 150 || lesson.walkthrough.length < 200) {
        console.warn("Generated lesson content is too short, regenerating...");
        // Could implement retry logic here if needed
      }
      
      // Log the AI call
      const latency_ms = Date.now() - t0;
      
      // Use the proper cost calculation from costs.ts
      let cost_usd = 0;
      if (_usage) {
        const { estimateCostUSD } = await import("@/lib/costs");
        cost_usd = estimateCostUSD(
          process.env.OPENAI_MODEL_LESSON || "gpt-5-mini",
          _usage.prompt_tokens || 0,
          _usage.completion_tokens || 0
        );
      }
      
      // Log the AI call for tracking
      try {
        await logCall({
          user_id: user.id,
          goal_id: goalId,
          endpoint: "lesson",
          model: process.env.OPENAI_MODEL_LESSON || "gpt-5-mini",
          prompt_tokens: _usage?.prompt_tokens || 0,
          completion_tokens: _usage?.completion_tokens || 0,
          success: true,
          latency_ms,
          cost_usd,
        });
        console.log("AI call logged successfully");
      } catch (logError) {
        console.error("Failed to log AI call:", logError);
      }
      
      // Write cache if template exists
      if (goal.plan_template_id) {
        try {
          console.log("Attempting to cache lesson template...");
          await supabase.from("lesson_template").insert({
            plan_template_id: goal.plan_template_id,
            day_index: dayIndex,
            version: 1,
            model: process.env.OPENAI_MODEL_LESSON || "gpt-5-mini",
            lesson_json: lesson,
          }).select("id").maybeSingle();
          console.log("Lesson template cached successfully");
        } catch (error) {
          console.log("Failed to cache lesson template:", error);
        }
      }

      // Also write to user-specific lesson_log for backward compatibility
      try {
        console.log("Attempting to save lesson log...");
        const { error: wErr } = await supabase.from("lesson_log").insert({
          user_id: user.id,
          goal_id: goalId,
          day_index: dayIndex,
          chunk_ids: null, // uuid[] column; we'll store null until we track actual chunk IDs
          model: process.env.OPENAI_MODEL_LESSON || "gpt-5-mini",
          citations: lesson.citations || [],  // jsonb array is OK
          lesson_json: lesson,                // <-- now exists and is jsonb
        });
        if (wErr) {
          console.log("Failed to save lesson log:", wErr);
        } else {
          console.log("Lesson log saved successfully");
        }
      } catch (error) {
        console.log("Lesson log save failed:", error);
      }
      
      console.log("Returning lesson with data:", {
        topic: lesson.topic,
        reading_length: lesson.reading?.length || 0,
        walkthrough_length: lesson.walkthrough?.length || 0,
        quiz_count: lesson.quiz?.length || 0,
        exercise: lesson.exercise?.substring(0, 50) + "...",
        est_minutes: lesson.est_minutes
      });
      
      return NextResponse.json({ reused: false, lesson });
    } catch (error) {
      console.error("Lesson generation failed:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        goalId,
        dayIndex,
        topic: goal.topic,
        focus: goal.focus,
        level: goal.level
      });
      
      // Log the failed AI call for tracking
      const latency_ms = Date.now() - t0;
      try {
        await logCall({
          user_id: user.id,
          goal_id: goalId,
          endpoint: "lesson",
          model: process.env.OPENAI_MODEL_LESSON || "gpt-5-mini",
          prompt_tokens: 0, // We don't have usage data for failed calls
          completion_tokens: 0,
          success: false,
          latency_ms,
          cost_usd: 0,
          error_text: error instanceof Error ? error.message : "Unknown error",
        });
        console.log("Failed AI call logged successfully");
      } catch (logError) {
        console.error("Failed to log failed AI call:", logError);
      }
      
      // Try to generate a fallback lesson
      try {
        console.log("Attempting to generate fallback lesson...");
        const fallbackLesson = {
          topic: `${goal.topic} Fundamentals - Day ${dayIndex}`,
          reading: `Today's lesson focuses on essential ${goal.topic} concepts. We'll cover the foundational principles that every ${goal.level} level student needs to master. This includes understanding basic terminology, core concepts, and practical applications. Take time to absorb each concept before moving to the practice section.`,
          walkthrough: `Begin by reading through the concepts carefully. Then practice each step methodically. Start with simple exercises and gradually increase difficulty. Remember, mastery comes from consistent practice and understanding fundamentals. If you struggle with any concept, review the reading section and try again.`,
          quiz: [
            {
              q: `What is the primary goal of learning ${goal.topic} fundamentals?`,
              a: ["To memorize facts quickly", "To build a strong foundation", "To skip basic concepts", "To finish lessons fast"],
              correct_index: 1
            },
            {
              q: "How should you approach practicing these concepts?",
              a: ["Rush through exercises", "Practice methodically", "Skip difficult parts", "Memorize without understanding"],
              correct_index: 1
            }
          ],
          exercise: `Practice the fundamental ${goal.topic} concepts for 15 minutes. Focus on understanding and accuracy rather than speed.`,
          citations: [`${goal.topic} learning fundamentals`],
          est_minutes: 15
        };
        
        console.log("Fallback lesson generated successfully");
        return NextResponse.json({ 
          reused: false, 
          lesson: fallbackLesson,
          fallback: true,
          original_error: error instanceof Error ? error.message : "Unknown error"
        });
      } catch (fallbackError) {
        console.error("Fallback lesson generation also failed:", fallbackError);
        
        // Return a more helpful error message
        const errorMessage = error instanceof Error ? error.message : "Unknown error in lesson generation";
        return NextResponse.json({ 
          error: errorMessage,
          details: "The AI failed to generate a valid lesson and fallback generation also failed. This might be due to malformed output or context issues."
        }, { status: 500 });
      }
    }
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error in GET /today";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 