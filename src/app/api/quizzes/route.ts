import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const goalId = url.searchParams.get("goal_id");
    const quizType = url.searchParams.get("quiz_type");
    const completed = url.searchParams.get("completed");

    const supabase = await supabaseServer();

    let query = supabase
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
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (goalId) {
      query = query.eq("goal_id", goalId);
    }

    if (quizType) {
      query = query.eq("quiz_type", quizType);
    }

    if (completed === "true") {
      query = query.not("completed_at", "is", null);
    } else if (completed === "false") {
      query = query.is("completed_at", null);
    }

    const { data: quizzes, error } = await query;

    if (error) {
      console.error("Failed to fetch quizzes:", error);
      return NextResponse.json(
        { error: "Failed to fetch quizzes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ quizzes: quizzes || [] });

  } catch (error) {
    console.error("Quiz fetch API error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
