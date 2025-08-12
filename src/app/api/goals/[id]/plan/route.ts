import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { retrieveContext } from "@/rag/retriever";
import { generatePlan } from "@/lib/aiCall";
import { buildPlannerPrompt } from "@/lib/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/goals/:id/plan
 * - If plan_json exists and no ?force=true, return it.
 * - Else generate a plan (with RAG context), save plan_json + bump plan_version, and return it.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user, supabase, res } = await requireUser(req);
    if (!user) return res!;
    const { id: goalId } = await params;
    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "true";

    // 1) Fetch goal
    const { data: goal, error: gErr } = await supabase
      .from("learning_goals")
      .select("id, topic, focus, plan_version, plan_json")
      .eq("id", goalId)
      .single();

    if (gErr || !goal) return NextResponse.json({ error: "Goal not found" }, { status: 404 });

    // 2) Return cached plan unless force
    if (goal.plan_json && !force) {
      return NextResponse.json(goal.plan_json);
    }

    // 3) Build RAG context + planner prompt
    const query = `${goal.topic} — ${goal.focus || "beginner track"}`;
    const { context } = await retrieveContext(query, 6, goal.topic);
    const msgs = buildPlannerPrompt(`Topic: ${goal.topic}\nFocus: ${goal.focus || "general"}\nUse this context:\n${context}`);

    // 4) Generate plan
    const { data: plan } = await generatePlan(msgs);

    // 5) Save plan_json + bump version
    const { error: uErr } = await supabase
      .from("learning_goals")
      .update({ plan_json: plan, plan_version: (goal.plan_version ?? 0) + 1 })
      .eq("id", goalId)
      .eq("user_id", user.id);
    if (uErr) return NextResponse.json({ error: uErr.message }, { status: 400 });

    return NextResponse.json(plan);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error in GET /plan";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 