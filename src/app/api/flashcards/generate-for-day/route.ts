import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { supabaseServer } from "@/lib/supabaseServer";
import { generateFlashcards } from "@/lib/aiCall";

export const dynamic = "force-dynamic";

// POST /api/flashcards/generate-for-day
// Manually trigger flashcard generation for a specific day
export async function POST(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { goal_id, day_index } = body;

    if (!goal_id || day_index === undefined) {
      return NextResponse.json(
        { error: "Missing goal_id or day_index" },
        { status: 400 }
      );
    }

    console.log(`📝 Manual flashcard generation request for goal ${goal_id}, day ${day_index}`);

    const supabase = await supabaseServer();

    // Check if flashcards already exist
    const { data: existingCards } = await supabase
      .from("flashcards")
      .select("id")
      .eq("user_id", user.id)
      .eq("goal_id", goal_id)
      .eq("lesson_day_index", day_index)
      .limit(1);

    if (existingCards && existingCards.length > 0) {
      return NextResponse.json({
        message: "Flashcards already exist",
        count: existingCards.length,
      });
    }

    // Get the goal
    const { data: goal, error: goalError } = await supabase
      .from("learning_goals")
      .select("id, topic, focus, plan_template_id")
      .eq("id", goal_id)
      .eq("user_id", user.id)
      .single();

    if (goalError || !goal) {
      return NextResponse.json(
        { error: "Goal not found" },
        { status: 404 }
      );
    }

    // Get the lesson
    let lesson: Record<string, unknown> | null = null;

    if (goal.plan_template_id) {
      const { data: templateLesson } = await supabase
        .from("lesson_templates")
        .select("lesson")
        .eq("plan_template_id", goal.plan_template_id)
        .eq("day_index", day_index)
        .single();

      if (templateLesson) {
        lesson = templateLesson.lesson as Record<string, unknown>;
      }
    }

    if (!lesson) {
      const { data: logLesson } = await supabase
        .from("lesson_log")
        .select("lesson_json")
        .eq("goal_id", goal_id)
        .eq("day_index", day_index)
        .single();

      if (logLesson) {
        lesson = logLesson.lesson_json as Record<string, unknown>;
      }
    }

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found for this day" },
        { status: 404 }
      );
    }

    // Get or create flashcard category
    let { data: category } = await supabase
      .from("flashcard_categories")
      .select("id")
      .eq("user_id", user.id)
      .eq("goal_id", goal_id)
      .single();

    if (!category) {
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

      if (categoryError || !newCategory) {
        return NextResponse.json(
          { error: "Failed to create flashcard category" },
          { status: 500 }
        );
      }

      category = newCategory;
    }

    // Prepare lesson content for AI
    const lessonContent = [{
      day: day_index + 1,
      topic: String(lesson.topic || `Day ${day_index + 1}`),
      reading: String(lesson.reading || ""),
      walkthrough: String(lesson.walkthrough || ""),
      quiz: (lesson.quiz as Array<{ question: string; options: string[]; correctAnswer: number }>) || undefined,
    }];

    if (!lessonContent[0].reading && !lessonContent[0].walkthrough) {
      return NextResponse.json(
        { error: "Lesson has no content to generate flashcards from" },
        { status: 400 }
      );
    }

    console.log("🤖 Generating flashcards with AI...");

    // Generate flashcards
    const { data: generatedCards, error: aiError } = await generateFlashcards(
      lessonContent,
      goal.topic,
      goal.focus
    );

    if (aiError || !generatedCards || generatedCards.length === 0) {
      console.error("Flashcard generation failed:", aiError);
      return NextResponse.json(
        { error: `Failed to generate flashcards: ${aiError || 'No cards generated'}` },
        { status: 500 }
      );
    }

    console.log(`✅ Generated ${generatedCards.length} flashcards`);

    // Save flashcards to database
    const flashcardsToInsert = generatedCards.map((card: Record<string, unknown>) => ({
      user_id: user.id,
      category_id: category.id,
      goal_id: goal_id,
      lesson_day_index: day_index,
      front: card.front,
      back: card.back,
      difficulty: card.difficulty || "medium",
      source: "lesson",
    }));

    const { data: savedCards, error: saveError } = await supabase
      .from("flashcards")
      .insert(flashcardsToInsert)
      .select();

    if (saveError) {
      console.error("Failed to save flashcards:", saveError);
      return NextResponse.json(
        { error: "Failed to save flashcards" },
        { status: 500 }
      );
    }

    console.log(`💾 Saved ${savedCards?.length || 0} flashcards to database`);

    return NextResponse.json({
      message: "Flashcards generated successfully",
      count: savedCards?.length || 0,
      flashcards: savedCards,
    });
  } catch (error) {
    console.error("Flashcard generation failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

