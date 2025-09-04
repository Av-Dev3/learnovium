import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/supabaseServer";
import { supabaseServer } from "@/lib/supabaseServer";
import { generateFlashcards } from "@/lib/aiCall";

export const dynamic = "force-dynamic";

// POST /api/flashcards/generate - Generate flashcards from lessons
export async function POST(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { goal_id, lesson_day_indices, category_id } = body;

    if (!goal_id || !lesson_day_indices || !Array.isArray(lesson_day_indices)) {
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
      return NextResponse.json(
        { error: "Goal not found or access denied" },
        { status: 404 }
      );
    }

    // Get lessons for the specified day indices
    const lessons = [];
    
    if (goal.plan_template_id) {
      // Get from lesson templates
      const { data: lessonTemplates, error: templateError } = await supabase
        .from("lesson_template")
        .select("day_index, lesson_json")
        .eq("plan_template_id", goal.plan_template_id)
        .in("day_index", lesson_day_indices)
        .eq("version", 1);

      if (templateError) {
        console.error("Error fetching lesson templates:", templateError);
      } else {
        lessons.push(...lessonTemplates.map(t => ({
          day_index: t.day_index,
          lesson: t.lesson_json
        })));
      }
    }

    // Get from user-specific lesson log (fallback or additional)
    const { data: userLessons, error: userLessonsError } = await supabase
      .from("lesson_log")
      .select("day_index, lesson_json")
      .eq("user_id", user.id)
      .eq("goal_id", goal_id)
      .in("day_index", lesson_day_indices);

    if (userLessonsError) {
      console.error("Error fetching user lessons:", userLessonsError);
    } else {
      // Add user lessons that aren't already in templates
      const templateDayIndices = new Set(lessons.map(l => l.day_index));
      userLessons.forEach(ul => {
        if (!templateDayIndices.has(ul.day_index)) {
          lessons.push({
            day_index: ul.day_index,
            lesson: ul.lesson_json
          });
        }
      });
    }

    if (lessons.length === 0) {
      return NextResponse.json(
        { error: "No lessons found for the specified day indices" },
        { status: 404 }
      );
    }

    // Get or create category
    let finalCategoryId = category_id;
    if (!finalCategoryId) {
      // Create a category for this goal if it doesn't exist
      const { data: existingCategory } = await supabase
        .from("flashcard_categories")
        .select("id")
        .eq("user_id", user.id)
        .eq("goal_id", goal_id)
        .single();

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
      const lesson = l.lesson as any;
      return {
        day: l.day_index + 1,
        topic: lesson.topic || `Day ${l.day_index + 1}`,
        reading: lesson.reading || "",
        walkthrough: lesson.walkthrough || "",
        quiz: lesson.quiz || []
      };
    }).filter(l => l.reading || l.walkthrough);

    if (lessonContent.length === 0) {
      return NextResponse.json(
        { error: "No valid lesson content found to generate flashcards" },
        { status: 400 }
      );
    }

    const { data: generatedCards, error: aiError } = await generateFlashcards(
      lessonContent,
      goal.topic,
      goal.focus
    );

    if (aiError || !generatedCards) {
      console.error("AI flashcard generation error:", aiError);
      return NextResponse.json(
        { error: "Failed to generate flashcards" },
        { status: 500 }
      );
    }

    // Save generated flashcards to database
    const flashcardsToInsert = generatedCards.map((card: any, index: number) => ({
      user_id: user.id,
      category_id: finalCategoryId,
      goal_id: goal_id,
      lesson_day_index: lesson_day_indices[Math.floor(index / 2)] || null, // Rough mapping
      front: card.front,
      back: card.back,
      difficulty: card.difficulty || "medium",
      source: "generated",
    }));

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
        { error: "Failed to save generated flashcards" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      flashcards: savedFlashcards,
      category_id: finalCategoryId,
      generated_count: savedFlashcards?.length || 0,
    }, { status: 201 });

  } catch (error) {
    console.error("Generate flashcards API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
