import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { goal_id, status, day_index } = await req.json();

    if (!goal_id || !status) {
      return NextResponse.json(
        { error: "Missing required fields: goal_id and status" },
        { status: 400 }
      );
    }

    if (status !== "completed") {
      return NextResponse.json(
        { error: "Invalid status. Only 'completed' is supported" },
        { status: 400 }
      );
    }

    const supa = await supabaseServer(req);

    // Verify the goal exists and belongs to the user
    const { data: goal, error: goalError } = await supa
      .from("learning_goals")
      .select("id")
      .eq("id", goal_id)
      .eq("user_id", user.id)
      .single();

    if (goalError || !goal) {
      return NextResponse.json(
        { error: "Goal not found or access denied" },
        { status: 404 }
      );
    }

    // Create or update progress record
    const progressData = {
      user_id: user.id,
      goal_id,
      status,
      day_index: day_index || null,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Try to insert first, then update if it exists
    const { data: progress, error: progressError } = await supa
      .from("lesson_progress")
      .upsert(progressData, {
        onConflict: "user_id,goal_id,day_index",
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (progressError) {
      console.error("Progress upsert error:", progressError);
      return NextResponse.json(
        { error: `Failed to save progress: ${progressError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      progress: {
        id: progress.id,
        goal_id: progress.goal_id,
        status: progress.status,
        day_index: progress.day_index,
        completed_at: progress.completed_at,
      },
    });

  } catch (e: unknown) {
    console.error("Error in POST /api/progress:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const goal_id = searchParams.get("goal_id");

    const supa = await supabaseServer(req);

    let query = supa
      .from("lesson_progress")
      .select("id, goal_id, status, day_index, completed_at, updated_at")
      .eq("user_id", user.id);

    if (goal_id) {
      query = query.eq("goal_id", goal_id);
    }

    const { data: progress, error: progressError } = await query
      .order("completed_at", { ascending: false });

    if (progressError) {
      return NextResponse.json(
        { error: `Failed to fetch progress: ${progressError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(progress || []);

  } catch (e: unknown) {
    console.error("Error in GET /api/progress:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 }
    );
  }
} 