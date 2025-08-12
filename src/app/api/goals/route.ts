import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/goals — list current user's goals
export async function GET(req: NextRequest) {
  try {
    const { user, supabase, res } = await requireUser(req);
    if (!user) return res!;
    const { data, error } = await supabase
      .from("learning_goals")
      .select("id, topic, focus, plan_version, created_at")
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? []);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error in GET /api/goals";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/goals — create a new goal
export async function POST(req: NextRequest) {
  try {
    const { user, supabase, res } = await requireUser(req);
    if (!user) return res!;
    const body = await req.json().catch(() => ({}));
    const { topic, focus } = body || {};
    if (!topic) return NextResponse.json({ error: "Missing topic" }, { status: 400 });

    const { data, error } = await supabase
      .from("learning_goals")
      .insert({ user_id: user.id, topic, focus, plan_version: 0 })
      .select("id, topic, focus")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error in POST /api/goals";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 