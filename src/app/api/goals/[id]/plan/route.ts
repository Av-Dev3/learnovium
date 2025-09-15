import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { retrieveContext } from "@/rag/retriever";
import { generatePlan } from "@/lib/aiCall";
import { buildPlannerPrompt } from "@/lib/prompts";
import { logCall } from "@/lib/aiGuard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/goals/:id/plan
 * - If plan_json exists and no ?force=true, return it.
 * - Else generate a plan (with RAG context), save plan_json + bump plan_version, and return it.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user: { id: string; email?: string } | null = null;
  let goalId: string | null = null;
  try {
    const userResult = await requireUser(req);
    user = userResult.user;
    const { supabase, res } = userResult;
    if (!user || !supabase) return res!;
    const paramsResult = await params;
    goalId = paramsResult.id;
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
    const t0 = Date.now();
    const { data: plan, usage } = await generatePlan(msgs, user.id, goalId);
    
    // Log the AI call for tracking
    const latency_ms = Date.now() - t0;
    const { modelFor } = await import("@/lib/openai");
    const usedModel = modelFor("planner");
    
    let cost_usd = 0;
    if (usage) {
      const { estimateCostUSD } = await import("@/lib/costs");
      cost_usd = estimateCostUSD(
        usedModel, // Use the actual model that was used
        usage.prompt_tokens || 0,
        usage.completion_tokens || 0
      );
    }
    
    try {
      
      await logCall({
        user_id: user.id,
        goal_id: goalId,
        endpoint: "planner",
        model: usedModel, // Use the actual model that was used
        prompt_tokens: usage?.prompt_tokens || 0,
        completion_tokens: usage?.completion_tokens || 0,
        success: true,
        latency_ms,
        cost_usd,
      });
      console.log("AI call logged successfully with model:", usedModel);
    } catch (logError) {
      console.error("Failed to log AI call:", logError);
    }

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
    
          // Log the failed AI call for tracking
      try {
        // Get the actual model that was attempted
        const { modelFor } = await import("@/lib/openai");
        const attemptedModel = modelFor("planner");
        
        await logCall({
          user_id: user?.id,
          goal_id: goalId || undefined,
          endpoint: "planner",
          model: attemptedModel, // Use the actual model that was attempted
          prompt_tokens: 0,
          completion_tokens: 0,
          success: false,
          latency_ms: 0,
          cost_usd: 0,
          error_text: errorMessage,
        });
        console.log("Failed AI call logged successfully with model:", attemptedModel);
      } catch (logError) {
        console.error("Failed to log failed AI call:", logError);
      }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 