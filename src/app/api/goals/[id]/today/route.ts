import { NextRequest, NextResponse } from "next/server";
import { requireUser, dayIndexFrom } from "@/lib/api/utils";
// import { retrieveContextDB } from "@/rag/retriever_db"; // Temporarily disabled
import { retrieveContext } from "@/rag/retriever"; // Fallback RAG retriever
import { generateLesson, generateFlashcards } from "@/lib/aiCall";
import { buildAdvancedLessonPrompt } from "@/lib/prompts";
import { logCall } from "@/lib/aiGuard"; // Re-enabled for AI call tracking
import { supabaseServer } from "@/lib/supabaseServer";

// Define the types inline since they're not exported from a central location
interface PlanDay {
  day_index: number;
  topic?: string;
  objective?: string;
  practice?: string;
  assessment?: string;
  est_minutes?: number;
}

interface PlanModule {
  days?: PlanDay[];
}

interface PlanData {
  modules?: PlanModule[];
}

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

// Helper function to generate flashcards from a lesson
async function generateFlashcardsFromLesson(
  userId: string,
  goalId: string,
  dayIndex: number,
  lesson: Record<string, unknown>,
  goalTopic: string,
  goalFocus?: string
) {
  try {
    console.log(`🚀 Starting flashcard generation for goal ${goalId}, day ${dayIndex}`);
    console.log(`📋 Lesson topic: ${lesson.topic || 'Unknown'}`);
    console.log(`📋 Lesson reading length: ${String(lesson.reading || '').length} characters`);
    console.log(`📋 Lesson walkthrough length: ${String(lesson.walkthrough || '').length} characters`);
    
    const supabase = await supabaseServer();

    // Check if flashcards already exist for this lesson
    const { data: existingCards } = await supabase
      .from("flashcards")
      .select("id")
      .eq("user_id", userId)
      .eq("goal_id", goalId)
      .eq("lesson_day_index", dayIndex)
      .limit(1);

    if (existingCards && existingCards.length > 0) {
      console.log(`Flashcards already exist for goal ${goalId}, day ${dayIndex} - skipping generation`);
      return;
    }

    // Get or create the flashcard category for this goal
    let { data: category } = await supabase
      .from("flashcard_categories")
      .select("id")
      .eq("user_id", userId)
      .eq("goal_id", goalId)
      .single();

    if (!category) {
      console.log(`Creating flashcard category for goal ${goalId}`);
      const { data: newCategory, error: categoryError } = await supabase
        .from("flashcard_categories")
        .insert({
          user_id: userId,
          goal_id: goalId,
          name: goalTopic,
          description: `Flashcards for ${goalTopic}${goalFocus ? ` - ${goalFocus}` : ''}`,
          color: '#6366f1', // Default brand color
        })
        .select("id")
        .single();

      if (categoryError) {
        console.error("Failed to create flashcard category:", categoryError);
        return;
      }
      category = newCategory;
      console.log(`Flashcard category created with ID: ${category.id}`);
    } else {
      console.log(`Using existing flashcard category: ${category.id}`);
    }

    // Prepare lesson content for flashcard generation
    const lessonContent = [{
      day: dayIndex + 1,
      topic: String(lesson.topic || `Day ${dayIndex + 1}`),
      reading: String(lesson.reading || ""),
      walkthrough: String(lesson.walkthrough || ""),
      quiz: (lesson.quiz as Array<{ question: string; options: string[]; correctAnswer: number }>) || undefined
    }];

    // Only generate flashcards if there's meaningful content
    const hasContent = lessonContent[0].reading.length > 800 || lessonContent[0].walkthrough.length > 400;
    console.log("Content validation:", {
      readingLength: lessonContent[0].reading.length,
      walkthroughLength: lessonContent[0].walkthrough.length,
      hasContent,
      dayIndex
    });
    
    if (!hasContent) {
      console.log(`Insufficient lesson content for flashcard generation on day ${dayIndex}`);
      return;
    }

    console.log(`🤖 Generating flashcards for lesson: ${lessonContent[0].topic}`);
    console.log("📝 Lesson content for flashcard generation:", {
      topic: lessonContent[0].topic,
      readingPreview: lessonContent[0].reading.substring(0, 200) + "...",
      walkthroughPreview: lessonContent[0].walkthrough.substring(0, 200) + "...",
      hasQuiz: !!lessonContent[0].quiz
    });
    
    // Generate flashcards using AI
    console.log("🔮 Calling AI to generate flashcards...");
    const { data: generatedCards, error } = await generateFlashcards(
      lessonContent,
      goalTopic,
      goalFocus
    );
    
    console.log("🔮 AI flashcard generation response:", {
      hasError: !!error,
      errorMessage: error,
      cardsGenerated: generatedCards?.length || 0,
      firstCardPreview: generatedCards?.[0] ? {
        front: generatedCards[0].front?.substring(0, 100) + "...",
        back: generatedCards[0].back?.substring(0, 100) + "...",
        difficulty: generatedCards[0].difficulty
      } : null
    });

    console.log("Flashcard generation result:", { 
      error, 
      generatedCards: generatedCards?.length || 0,
      generatedCardsData: generatedCards 
    });

    if (error || !generatedCards || generatedCards.length === 0) {
      console.warn("Failed to generate flashcards:", error);
      return;
    }

    console.log(`AI generated ${generatedCards.length} flashcards`);

    // Save flashcards to database
    const flashcardsToInsert = generatedCards.map((card: Record<string, unknown>) => ({
      user_id: userId,
      category_id: category.id,
      goal_id: goalId,
      lesson_day_index: dayIndex,
      front: card.front,
      back: card.back,
      difficulty: card.difficulty || "medium",
      source: "lesson",
    }));

    console.log("💾 Saving flashcards to database:", {
      count: flashcardsToInsert.length,
      categoryId: category.id,
      sample: flashcardsToInsert[0]
    });

    const { error: saveError } = await supabase
      .from("flashcards")
      .insert(flashcardsToInsert);

    if (saveError) {
      console.error("❌ Failed to save generated flashcards:", saveError);
      console.error("💾 Save error details:", {
        message: saveError.message,
        code: saveError.code,
        details: saveError.details,
        hint: saveError.hint
      });
    } else {
      console.log(`✅ Successfully generated and saved ${generatedCards.length} flashcards for goal ${goalId}, day ${dayIndex}`);
      console.log(`📚 Flashcards are now available in category ${category.id}`);
    }
  } catch (error) {
    console.error("❌ Error in generateFlashcardsFromLesson:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      userId,
      goalId,
      dayIndex,
      goalTopic
    });
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Add timeout configuration for lesson generation
const LESSON_GENERATION_TIMEOUT_MS = 120000; // 2 minutes for lesson generation
const RAG_TIMEOUT_MS = 45000; // 45 seconds for RAG operations

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
      .select("id, topic, focus, level, created_at, plan_template_id, plan_json")
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
    
    // Get the planned topic for today from the plan_json
    let plannedTopic = `Day ${dayIndex} lesson`;
    let plannedFocus = goal.focus || `basic ${goal.topic} concepts`;
    
    if (goal.plan_json) {
      try {
        const plan = goal.plan_json as PlanData;
        const flatDays = (plan.modules || []).flatMap((m: PlanModule) => m.days || []);
        const plannedDay = flatDays.find((d: PlanDay) => d.day_index === dayIndex);
        
        if (plannedDay) {
          plannedTopic = plannedDay.topic || `Day ${dayIndex} lesson`;
          plannedFocus = plannedDay.objective || plannedDay.practice || plannedDay.assessment || plannedFocus;
          console.log(`Using planned topic for day ${dayIndex}: ${plannedTopic}`);
        }
      } catch (error) {
        console.log(`Error reading planned topic: ${error}`);
      }
    }
    
    // Focus query should be about the planned topic, not random variations
    const focusQuery = `${goal.topic} — ${plannedTopic} (level: ${userLevel}, day ${dayIndex})`;

    // Retrieve context relevant to the planned topic with timeout
    const ragPromise = retrieveContext(focusQuery, 3, goal.topic);
    const ragTimeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('RAG operation timeout')), RAG_TIMEOUT_MS)
    );
    
    const { context } = await Promise.race([ragPromise, ragTimeoutPromise]);
    
    // Build lesson prompt focused on the planned topic
    const msgs = buildAdvancedLessonPrompt(context, goal.topic, plannedFocus, dayIndex, userLevel);
    
    try {
      // Add timeout wrapper for lesson generation
      const lessonGenerationPromise = generateLesson(msgs, user.id, goalId);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Lesson generation timeout')), LESSON_GENERATION_TIMEOUT_MS)
      );
      
      const { data: lesson, usage: _usage } = await Promise.race([lessonGenerationPromise, timeoutPromise]);
      
      // Validate the lesson quality
      if (!lesson || !lesson.topic || !lesson.reading || !lesson.walkthrough) {
        console.error("Generated lesson is incomplete:", lesson);
        throw new Error("Failed to generate complete lesson");
      }
      
      // Ensure the lesson is focused and practical
      if (lesson.topic.length < 10 || lesson.reading.length < 800 || lesson.walkthrough.length < 400) {
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

      // Generate flashcards from this lesson (async, don't block response)
      console.log("🚀 Starting async flashcard generation for lesson...");
      generateFlashcardsFromLesson(user.id, goalId, dayIndex, lesson, goal.topic, goal.focus)
        .then(() => {
          console.log("✅ Flashcard generation completed successfully");
          console.log(`📚 Flashcards should now be available for goal ${goalId}, day ${dayIndex}`);
        })
        .catch(error => {
          console.error("❌ Failed to generate flashcards from lesson:", error);
          console.error("Error details:", {
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
            goalId,
            dayIndex,
            topic: goal.topic
          });
          console.error("🔍 This error means flashcards won't be created for this lesson. Check the database migration and AI response format.");
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
      
      // Check if it's a timeout error
      const isTimeout = error instanceof Error && (
        error.message.includes('timeout') || 
        error.message.includes('Lesson generation timeout') ||
        error.message.includes('RAG operation timeout')
      );
      
      if (isTimeout) {
        console.log("Lesson generation timeout detected, proceeding to fallback");
      }
      
      // Log the failed AI call for tracking
      const latency_ms = Date.now() - t0;
      try {
        // Get the actual model that was attempted
        const { modelFor } = await import("@/lib/openai");
        const attemptedModel = modelFor("lesson");
        
        await logCall({
          user_id: user.id,
          goal_id: goalId,
          endpoint: "lesson",
          model: attemptedModel, // Use the actual model that was attempted
          prompt_tokens: 0, // We don't have usage data for failed calls
          completion_tokens: 0,
          success: false,
          latency_ms,
          cost_usd: 0,
          error_text: error instanceof Error ? error.message : "Unknown error",
        });
        console.log("Failed AI call logged successfully with model:", attemptedModel);
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
        
        // Save fallback lesson to database
        try {
          const { error: saveError } = await supabase.from("lesson_log").insert({
            user_id: user.id,
            goal_id: goalId,
            day_index: dayIndex,
            chunk_ids: null,
            model: process.env.OPENAI_MODEL_LESSON || "gpt-5-mini",
            citations: fallbackLesson.citations || [],
            lesson_json: fallbackLesson,
          });
          
          if (saveError) {
            console.warn("Failed to save fallback lesson:", saveError);
          } else {
            console.log("Fallback lesson saved to database");
          }
        } catch (saveError) {
          console.warn("Error saving fallback lesson:", saveError);
        }
        
        // Generate flashcards from fallback lesson (async, don't block response)
        console.log("🚀 Starting async flashcard generation for fallback lesson...");
        generateFlashcardsFromLesson(user.id, goalId, dayIndex, fallbackLesson, goal.topic, goal.focus)
          .then(() => {
            console.log("✅ Flashcard generation from fallback completed successfully");
            console.log(`📚 Fallback flashcards should now be available for goal ${goalId}, day ${dayIndex}`);
          })
          .catch(error => {
            console.error("❌ Failed to generate flashcards from fallback lesson:", error);
            console.error("Fallback error details:", {
              message: error instanceof Error ? error.message : "Unknown error",
              stack: error instanceof Error ? error.stack : undefined,
              goalId,
              dayIndex,
              topic: goal.topic
            });
            console.error("🔍 This error means flashcards won't be created even from the fallback lesson. Check the database migration and AI response format.");
          });
        
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