import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";
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

    const supa = await supabaseServer(req);

    // Fetch the goal
    const { data: goal, error: goalError } = await supa
      .from("learning_goals")
      .select("id, topic, focus, created_at, plan_version, plan_json")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (goalError) {
      if (goalError.code === "PGRST116") {
        return NextResponse.json({ error: "Goal not found" }, { status: 404 });
      }
      return NextResponse.json(
        { error: `Failed to fetch goal: ${goalError.message}` },
        { status: 500 }
      );
    }

    // Fetch progress data for this goal
    const { data: progress, error: progressError } = await supa
      .from("lesson_progress")
      .select("id, lesson_id, completed_at, score")
      .eq("goal_id", id)
      .eq("user_id", user.id)
      .not("completed_at", "is", null);

    if (progressError) {
      console.warn("Failed to fetch progress:", progressError.message);
    }

    // Calculate progress metrics
    const completedLessons = progress?.length || 0;
    let totalLessons = 0;

    // If we have a plan, count total lessons
    if (goal.plan_json && typeof goal.plan_json === "object") {
      const plan = goal.plan_json as { modules?: Array<{ day: number; title: string; topic: string; objective: string; est_minutes: number }> };
      if (plan.modules && Array.isArray(plan.modules)) {
        totalLessons = plan.modules.length;
      }
    }

    // Parse plan_json if it exists
    let parsedPlan = null;
    if (goal.plan_json && typeof goal.plan_json === "object") {
      try {
        parsedPlan = goal.plan_json;
      } catch (e) {
        console.warn("Failed to parse plan_json:", e);
      }
    }

    return NextResponse.json({
      goal: {
        id: goal.id,
        topic: goal.topic,
        focus: goal.focus,
        created_at: goal.created_at,
        plan_version: goal.plan_version,
      },
      plan_json: parsedPlan,
      completed_lessons: completedLessons,
      total_lessons: totalLessons,
    });
  } catch (e: unknown) {
    console.error("Error in GET /api/goals/[id]:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 }
    );
  }
} 