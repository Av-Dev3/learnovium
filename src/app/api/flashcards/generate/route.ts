import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { supabaseServer } from "@/lib/supabaseServer";
import { generateFlashcards } from "@/lib/aiCall";

export const dynamic = "force-dynamic";

// POST /api/flashcards/generate - Generate flashcards from lessons
export async function POST(req: NextRequest) {
  try {
    console.log("Flashcard generate API called");
    const { user } = await requireUser(req);
    if (!user) {
      console.log("No user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Request body:", body);
    const { goal_id, lesson_day_indices, category_id } = body;

    if (!goal_id || !lesson_day_indices || !Array.isArray(lesson_day_indices)) {
      console.log("Missing required fields:", { goal_id, lesson_day_indices });
      return NextResponse.json(
        { error: "Missing required fields: goal_id, lesson_day_indices (array)" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // Verify goal belongs to user
    const { data: goal, error: goalError } = await supabase
      .from("learning_goals")
      .select("id, topic, focus, plan_template_id")
      .eq("id", goal_id)
      .eq("user_id", user.id)
      .single();

    if (goalError || !goal) {
      console.log("Goal error:", goalError);
      return NextResponse.json(
        { error: "Goal not found or access denied" },
        { status: 404 }
      );
    }

    console.log("Goal found:", goal);

    // Get lessons for the specified day indices
    const lessons = [];
    
    console.log("Looking for lessons with:", {
      goal_id,
      lesson_day_indices,
      plan_template_id: goal.plan_template_id
    });

    if (goal.plan_template_id) {
      // Get from lesson templates
      console.log("Checking lesson_template table...");
      const { data: lessonTemplates, error: templateError } = await supabase
        .from("lesson_template")
        .select("day_index, lesson_json")
        .eq("plan_template_id", goal.plan_template_id)
        .in("day_index", lesson_day_indices)
        .eq("version", 1);

      if (templateError) {
        console.error("Error fetching lesson templates:", templateError);
      } else {
        console.log(`Found ${lessonTemplates?.length || 0} lesson templates`);
        lessons.push(...(lessonTemplates || []).map(t => ({
          day_index: t.day_index,
          lesson: t.lesson_json
        })));
      }
    }

    // Get from user-specific lesson log (fallback or additional)
    console.log("Checking lesson_log table...");
    const { data: userLessons, error: userLessonsError } = await supabase
      .from("lesson_log")
      .select("day_index, lesson_json")
      .eq("user_id", user.id)
      .eq("goal_id", goal_id)
      .in("day_index", lesson_day_indices);

    if (userLessonsError) {
      console.error("Error fetching user lessons:", userLessonsError);
    } else {
      console.log(`Found ${userLessons?.length || 0} user lessons`);
      // Add user lessons that aren't already in templates
      const templateDayIndices = new Set(lessons.map(l => l.day_index));
      (userLessons || []).forEach(ul => {
        if (!templateDayIndices.has(ul.day_index)) {
          lessons.push({
            day_index: ul.day_index,
            lesson: ul.lesson_json
          });
        }
      });
    }

    console.log(`Total lessons found: ${lessons.length}`);
    console.log("Lesson day indices found:", lessons.map(l => l.day_index));

    if (lessons.length === 0) {
      // Try to generate lessons for the missing day indices
      console.log("No lessons found, attempting to generate them...");
      
      try {
        const { generateLesson } = await import("@/lib/aiCall");
        const { buildAdvancedLessonPrompt } = await import("@/lib/prompts");
        const { retrieveContext } = await import("@/rag/retriever");
        
        for (const dayIndex of lesson_day_indices) {
          console.log(`Generating lesson for day ${dayIndex}...`);
          
          // Generate a lesson for this day
          const focusQuery = `${goal.topic} — Day ${dayIndex + 1} lesson (level: ${goal.level || 'beginner'})`;
          const { context } = await retrieveContext(focusQuery, 3, goal.topic);
          const msgs = buildAdvancedLessonPrompt(context, goal.topic, goal.focus || `basic ${goal.topic} concepts`, dayIndex, goal.level || 'beginner');
          
          const { data: lesson, error: lessonError } = await generateLesson(msgs, user.id, goal_id);
          
          if (lessonError || !lesson) {
            console.error(`Failed to generate lesson for day ${dayIndex}:`, lessonError);
            continue;
          }
          
          // Save the lesson to lesson_log
          const { error: saveError } = await supabase.from("lesson_log").insert({
            user_id: user.id,
            goal_id: goal_id,
            day_index: dayIndex,
            chunk_ids: null,
            model: process.env.OPENAI_MODEL_LESSON || "gpt-5-mini",
            citations: lesson.citations || [],
            lesson_json: lesson,
          });
          
          if (saveError) {
            console.error(`Failed to save lesson for day ${dayIndex}:`, saveError);
            continue;
          }
          
          lessons.push({
            day_index: dayIndex,
            lesson: lesson
          });
          
          console.log(`Successfully generated and saved lesson for day ${dayIndex}`);
        }
        
        if (lessons.length === 0) {
          return NextResponse.json(
            { 
              error: "Failed to generate lessons for the specified day indices. Please ensure you have lessons available or try generating them first.",
              debug: {
                goal_id,
                lesson_day_indices,
                plan_template_id: goal.plan_template_id,
                user_id: user.id
              }
            },
            { status: 404 }
          );
        }
        
        console.log(`Generated ${lessons.length} lessons successfully`);
      } catch (generateError) {
        console.error("Error generating lessons:", generateError);
        return NextResponse.json(
          { 
            error: "No lessons found for the specified day indices and failed to generate new ones",
            debug: {
              goal_id,
              lesson_day_indices,
              plan_template_id: goal.plan_template_id,
              user_id: user.id,
              generate_error: generateError instanceof Error ? generateError.message : "Unknown error"
            }
          },
          { status: 404 }
        );
      }
    }

    // Get or create category
    let finalCategoryId = category_id;
    if (!finalCategoryId) {
      console.log("Creating or finding category...");
      // Create a category for this goal if it doesn't exist
      const { data: existingCategory, error: categoryCheckError } = await supabase
        .from("flashcard_categories")
        .select("id")
        .eq("user_id", user.id)
        .eq("goal_id", goal_id)
        .single();

      if (categoryCheckError && categoryCheckError.code !== 'PGRST116') {
        console.error("Error checking for existing category:", categoryCheckError);
        return NextResponse.json(
          { error: "Database error: flashcard_categories table may not exist. Please run the migration first." },
          { status: 500 }
        );
      }

      if (existingCategory) {
        finalCategoryId = existingCategory.id;
      } else {
        const { data: newCategory, error: categoryError } = await supabase
          .from("flashcard_categories")
          .insert({
            user_id: user.id,
            goal_id: goal_id,
            name: goal.topic,
            description: `Flashcards for ${goal.topic}`,
          })
          .select("id")
          .single();

        if (categoryError) {
          console.error("Error creating category:", categoryError);
          return NextResponse.json(
            { error: "Failed to create flashcard category" },
            { status: 500 }
          );
        }

        finalCategoryId = newCategory.id;
      }
    }

    // Generate flashcards using AI
    const lessonContent = lessons.map(l => {
      const lesson = l.lesson as Record<string, unknown>;
      return {
        day: l.day_index + 1,
        topic: String(lesson.topic || `Day ${l.day_index + 1}`),
        reading: String(lesson.reading || ""),
        walkthrough: String(lesson.walkthrough || ""),
        quiz: (lesson.quiz as Array<{ question: string; options: string[]; correctAnswer: number }>) || undefined
      };
    }).filter(l => l.reading || l.walkthrough);

    if (lessonContent.length === 0) {
      return NextResponse.json(
        { error: "No valid lesson content found to generate flashcards" },
        { status: 400 }
      );
    }

    console.log("Generating flashcards with AI...");
    const { data: generatedCards, error: aiError } = await generateFlashcards(
      lessonContent,
      goal.topic,
      goal.focus
    );

    if (aiError || !generatedCards) {
      console.error("AI flashcard generation error:", aiError);
      return NextResponse.json(
        { error: `Failed to generate flashcards: ${aiError || 'Unknown error'}` },
        { status: 500 }
      );
    }

    console.log("Generated cards:", generatedCards.length);

    // Save generated flashcards to database
    const flashcardsToInsert = generatedCards.map((card: Record<string, unknown>, index: number) => ({
      user_id: user.id,
      category_id: finalCategoryId,
      goal_id: goal_id,
      lesson_day_index: lesson_day_indices[Math.floor(index / 2)] || null, // Rough mapping
      front: card.front,
      back: card.back,
      difficulty: card.difficulty || "medium",
      source: "generated",
    }));

    console.log("Saving flashcards to database...");
    const { data: savedFlashcards, error: saveError } = await supabase
      .from("flashcards")
      .insert(flashcardsToInsert)
      .select(`
        id,
        front,
        back,
        difficulty,
        mastery_score,
        source,
        lesson_day_index,
        created_at
      `);

    if (saveError) {
      console.error("Error saving flashcards:", saveError);
      return NextResponse.json(
        { error: `Failed to save generated flashcards: ${saveError.message}. Please ensure the migration has been run.` },
        { status: 500 }
      );
    }

    console.log("Saved flashcards:", savedFlashcards?.length || 0);

    return NextResponse.json({
      flashcards: savedFlashcards,
      category_id: finalCategoryId,
      generated_count: savedFlashcards?.length || 0,
    }, { status: 201 });

  } catch (error) {
    console.error("Generate flashcards API error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
