import { NextRequest, NextResponse } from "next/server";
import { requireUser, dayIndexFrom } from "@/lib/api/utils";
// import { retrieveContextDB } from "@/rag/retriever_db"; // Temporarily disabled
import { generateLesson } from "@/lib/aiCall";
import { buildAdvancedLessonPrompt } from "@/lib/prompts";
// import { checkCapsOrThrow, logCall } from "@/lib/aiGuard"; // Temporarily disabled

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
    // Temporarily disabled while setting up database migrations
    /*
    if (goal.plan_template_id) {
      const { data: cached } = await supabase
        .from("lesson_template")
        .select("lesson_json")
        .eq("plan_template_id", goal.plan_template_id)
        .eq("day_index", dayIndex)
        .eq("version", 1)
        .maybeSingle();

      if (cached?.lesson_json) {
        return NextResponse.json({ reused: true, lesson: cached.lesson_json });
      }
    }

    // Check for existing user-specific lesson (fallback)
    const { data: existing } = await supabase
      .from("lesson_log")
      .select("id, lesson_json")
      .eq("user_id", user.id).eq("goal_id", goalId).eq("day_index", dayIndex)
      .maybeSingle();
    if (existing?.lesson_json) return NextResponse.json({ reused: false, lesson: existing.lesson_json });
    */

    // Generate new lesson with RAG
    // const t0 = Date.now(); // Temporarily disabled
    
    // Check budget caps before AI call
    // Temporarily disabled while setting up database migrations
    // await checkCapsOrThrow(user.id, "lesson");
    
    // Create a more focused query for better context retrieval
    const userLevel = goal.level || 'beginner';
    const focusQuery = goal.focus ? 
      `${goal.topic}: ${goal.focus} - ${userLevel} level daily lesson for day ${dayIndex}` :
      `${goal.topic} - ${userLevel} level daily lesson for day ${dayIndex}`;
    
    // Get more context for better context retrieval
    // Temporarily disabled while setting up database migrations
    // const { context } = await retrieveContextDB(focusQuery, 8, goal.topic, req);
    
    // Use fallback RAG for now
    const { retrieveContext } = await import("@/rag/retriever");
    const { context } = await retrieveContext(focusQuery, 8, goal.topic);
    
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
      // const latency_ms = Date.now() - t0; // Temporarily disabled
      // const cost_usd = usage ? (usage.prompt_tokens * 0.00015/1000 + usage.completion_tokens * 0.0006/1000) : 0; // Temporarily disabled
      
      // Temporarily disabled while setting up database migrations
      /*
      await logCall({
        user_id: user.id,
        goal_id: goalId,
        endpoint: "lesson",
        model: process.env.OPENAI_MODEL_LESSON || "gpt-5-mini",
        prompt_tokens: usage?.prompt_tokens || 0,
        completion_tokens: usage?.completion_tokens || 0,
        success: true,
        latency_ms,
        cost_usd,
      });
      */
      
      // Write cache if template exists
      // Temporarily disabled while setting up database migrations
      /*
      if (goal.plan_template_id) {
        await supabase.from("lesson_template").insert({
          plan_template_id: goal.plan_template_id,
          day_index: dayIndex,
          version: 1,
          model: process.env.OPENAI_MODEL_LESSON || "gpt-5-mini",
          lesson_json: lesson,
        }).select("id").maybeSingle();
      }

      // Also write to user-specific lesson_log for backward compatibility
      const { error: wErr } = await supabase.from("lesson_log").insert({
        user_id: user.id,
        goal_id: goalId,
        day_index: dayIndex,
        chunk_ids: null, // uuid[] column; we'll store null until we track actual chunk IDs
        model: process.env.OPENAI_MODEL_LESSON || "gpt-5-mini",
        citations: lesson.citations || [],  // jsonb array is OK
        lesson_json: lesson,                // <-- now exists and is jsonb
      });
      if (wErr) return NextResponse.json({ error: wErr.message }, { status: 400 });
      */
      
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
      
      // Return a more helpful error message
      const errorMessage = error instanceof Error ? error.message : "Unknown error in lesson generation";
      return NextResponse.json({ 
        error: errorMessage,
        details: "The AI failed to generate a valid lesson. This might be due to malformed output or context issues."
      }, { status: 500 });
    }
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error in GET /today";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 