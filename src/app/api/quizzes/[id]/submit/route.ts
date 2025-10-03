import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

interface QuizAnswer {
  question_id: string;
  selected_answer_index?: number;
  selected_answer_text?: string;
  time_spent_seconds?: number;
}

interface SubmitQuizRequest {
  answers: QuizAnswer[];
  total_time_seconds: number;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body: SubmitQuizRequest = await req.json();
    const { answers, total_time_seconds } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid answers format" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // Verify quiz exists and belongs to user
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select(`
        id,
        total_questions,
        completed_at,
        quiz_questions!inner(
          id,
          correct_answer_index,
          correct_answer_text,
          points
        )
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

    // Check if quiz is already completed
    if (quiz.completed_at) {
      return NextResponse.json(
        { error: "Quiz already completed" },
        { status: 400 }
      );
    }

    // Process answers and calculate score
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    const attemptsToInsert = [];

    for (const answer of answers) {
      const question = quiz.quiz_questions.find((q: { id: string }) => q.id === answer.question_id);
      if (!question) continue;

      let isCorrect = false;

      if (answer.selected_answer_index !== undefined) {
        // Multiple choice answer
        isCorrect = answer.selected_answer_index === question.correct_answer_index;
      } else if (answer.selected_answer_text !== undefined) {
        // Text answer (true/false or fill-in-the-blank)
        const correctText = question.correct_answer_text?.toLowerCase().trim();
        const userText = answer.selected_answer_text.toLowerCase().trim();
        isCorrect = correctText === userText;
      }

      if (isCorrect) {
        correctAnswers++;
        earnedPoints += question.points || 1;
      }
      totalPoints += question.points || 1;

      attemptsToInsert.push({
        quiz_id: id,
        question_id: answer.question_id,
        user_id: user.id,
        selected_answer_index: answer.selected_answer_index,
        selected_answer_text: answer.selected_answer_text,
        is_correct: isCorrect,
        time_spent_seconds: answer.time_spent_seconds
      });
    }

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    // Save quiz attempts
    const { error: attemptsError } = await supabase
      .from("quiz_attempts")
      .insert(attemptsToInsert);

    if (attemptsError) {
      console.error("Failed to save quiz attempts:", attemptsError);
      return NextResponse.json(
        { error: "Failed to save quiz answers" },
        { status: 500 }
      );
    }

    // Update quiz with completion data
    const { error: updateError } = await supabase
      .from("quizzes")
      .update({
        completed_at: new Date().toISOString(),
        score: score,
        time_taken_seconds: total_time_seconds
      })
      .eq("id", id);

    if (updateError) {
      console.error("Failed to update quiz completion:", updateError);
      return NextResponse.json(
        { error: "Failed to update quiz completion" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      score,
      correct_answers: correctAnswers,
      total_questions: quiz.total_questions,
      earned_points: earnedPoints,
      total_points: totalPoints,
      time_taken_seconds: total_time_seconds
    });

  } catch (error) {
    console.error("Quiz submission API error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
