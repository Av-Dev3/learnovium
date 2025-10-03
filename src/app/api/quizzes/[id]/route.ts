import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await supabaseServer();

    // Get quiz details
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select(`
        id,
        title,
        description,
        quiz_type,
        difficulty,
        time_limit_minutes,
        total_questions,
        completed_at,
        score,
        time_taken_seconds,
        created_at,
        learning_goals!inner(topic, focus)
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Get quiz questions
    const { data: questions, error: questionsError } = await supabase
      .from("quiz_questions")
      .select(`
        id,
        question_text,
        question_type,
        options,
        correct_answer_index,
        correct_answer_text,
        difficulty,
        points,
        explanation,
        question_order
      `)
      .eq("quiz_id", id)
      .order("question_order");

    if (questionsError) {
      console.error("Failed to fetch quiz questions:", questionsError);
      return NextResponse.json(
        { error: "Failed to fetch quiz questions" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      quiz,
      questions: questions || []
    });

  } catch (error) {
    console.error("Quiz details API error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await supabaseServer();

    // Verify quiz belongs to user
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Delete quiz (cascade will delete questions and attempts)
    const { error: deleteError } = await supabase
      .from("quizzes")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Failed to delete quiz:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete quiz" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Quiz deleted successfully" });

  } catch (error) {
    console.error("Quiz deletion API error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
