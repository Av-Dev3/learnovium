import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { supabaseServer } from "@/lib/supabaseServer";
import { generateQuiz } from "@/lib/quizGenerator";

export const dynamic = "force-dynamic";

interface GenerateQuizRequest {
  goal_id: string;
  quiz_type: 'lesson' | 'weekly';
  lesson_day_index?: number; // for lesson quizzes
  week_start_day?: number;   // for weekly quizzes
  week_end_day?: number;     // for weekly quizzes
  difficulty?: 'easy' | 'medium' | 'hard';
  question_count?: number;
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: GenerateQuizRequest = await req.json();
    const { 
      goal_id, 
      quiz_type, 
      lesson_day_index, 
      week_start_day, 
      week_end_day,
      difficulty = 'medium',
      question_count = 10
    } = body;

    if (!goal_id || !quiz_type) {
      return NextResponse.json(
        { error: "Missing required fields: goal_id, quiz_type" },
        { status: 400 }
      );
    }

    if (quiz_type === 'lesson' && lesson_day_index === undefined) {
      return NextResponse.json(
        { error: "lesson_day_index is required for lesson quizzes" },
        { status: 400 }
      );
    }

    if (quiz_type === 'weekly' && (week_start_day === undefined || week_end_day === undefined)) {
      return NextResponse.json(
        { error: "week_start_day and week_end_day are required for weekly quizzes" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // Verify goal exists and belongs to user
    const { data: goal, error: goalError } = await supabase
      .from("learning_goals")
      .select("id, topic, focus, plan_json")
      .eq("id", goal_id)
      .eq("user_id", user.id)
      .single();

    if (goalError || !goal) {
      return NextResponse.json(
        { error: "Goal not found or access denied" },
        { status: 404 }
      );
    }

    // Generate quiz using AI
    const { data: quizData, error: generationError } = await generateQuiz({
      goal,
      quiz_type,
      lesson_day_index,
      week_start_day,
      week_end_day,
      difficulty,
      question_count
    });

    if (generationError || !quizData) {
      console.error("Quiz generation failed:", generationError);
      return NextResponse.json(
        { error: `Failed to generate quiz: ${generationError || 'Unknown error'}` },
        { status: 500 }
      );
    }

    // Save quiz to database
    const { data: savedQuiz, error: saveError } = await supabase
      .from("quizzes")
      .insert({
        user_id: user.id,
        goal_id: goal_id,
        title: quizData.title,
        description: quizData.description,
        quiz_type: quiz_type,
        source_lesson_day_index: lesson_day_index,
        source_week_start_day: week_start_day,
        source_week_end_day: week_end_day,
        difficulty: difficulty,
        time_limit_minutes: quizData.time_limit_minutes || 30,
        total_questions: quizData.questions.length
      })
      .select()
      .single();

    if (saveError) {
      console.error("Failed to save quiz:", saveError);
      return NextResponse.json(
        { error: "Failed to save quiz" },
        { status: 500 }
      );
    }

    // Save quiz questions
    const questionsToInsert = quizData.questions.map((question, index) => ({
      quiz_id: savedQuiz.id,
      question_text: question.question,
      question_type: question.type || 'multiple_choice',
      options: question.options,
      correct_answer_index: question.correct_answer_index,
      correct_answer_text: question.correct_answer_text,
      difficulty: question.difficulty || difficulty,
      points: question.points || 1,
      explanation: question.explanation,
      question_order: index + 1
    }));

    const { data: savedQuestions, error: questionsError } = await supabase
      .from("quiz_questions")
      .insert(questionsToInsert)
      .select();

    if (questionsError) {
      console.error("Failed to save quiz questions:", questionsError);
      // Clean up the quiz if questions failed to save
      await supabase.from("quizzes").delete().eq("id", savedQuiz.id);
      return NextResponse.json(
        { error: "Failed to save quiz questions" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      quiz: savedQuiz,
      questions: savedQuestions,
      message: "Quiz generated successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Quiz generation API error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
