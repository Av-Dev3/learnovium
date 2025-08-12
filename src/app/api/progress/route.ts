import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { user, supabase, res } = await requireUser();
  if (!user) return res!;
  const body = await req.json().catch(() => ({}));
  const { goal_id, day_index, status, score, notes } = body || {};
  if (!goal_id || !day_index) return NextResponse.json({ error: "Missing goal_id or day_index" }, { status: 400 });

  const { error } = await supabase.from("progress").insert({
    user_id: user.id,
    goal_id,
    day_index,
    status: status ?? "done",
    score: score ?? null,
    notes: notes ?? null,
    completed_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
} 