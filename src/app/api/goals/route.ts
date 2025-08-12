import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/goals — list current user's goals
export async function GET() {
  const { user, supabase, res } = await requireUser();
  if (!user) return res!;
  const { data, error } = await supabase
    .from("learning_goals")
    .select("id, topic, focus, plan_version, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data ?? []);
}

// POST /api/goals — create a new goal (no plan build yet)
export async function POST(req: NextRequest) {
  const { user, supabase, res } = await requireUser();
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
} 