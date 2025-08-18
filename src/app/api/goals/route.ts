import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { canonicalizeSignature } from "@/lib/goalSignature";
import { buildPlannerPromptWithRAG } from "@/lib/prompts";
import { generatePlan } from "@/lib/aiCall";
import { checkCapsOrThrow, logCall } from "@/lib/aiGuard";

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

// POST /api/goals — create a new goal with template caching
export async function POST(req: NextRequest) {
  try {
    const { user, supabase, res } = await requireUser(req);
    if (!user) return res!;
    
    const body = await req.json().catch(() => ({}));
    const { topic, focus, level, minutes_per_day } = body || {};
    if (!topic) return NextResponse.json({ error: "Missing topic" }, { status: 400 });

    // Pull profile to build signature
    const { data: profile } = await supabase
      .from("profiles")
      .select("level, minutes_per_day, tz")
      .eq("id", user.id)
      .maybeSingle();

    const signature = await canonicalizeSignature({
      topic,
      focus,
      level: level || profile?.level || null,
      minutes_per_day: minutes_per_day || profile?.minutes_per_day || null,
      locale: profile?.tz || "en",
      version: 1,
    });

    // 1) Try to reuse existing plan_template
    let template = null;
    try {
      const { data: templateData } = await supabase
        .from("plan_template")
        .select("id, plan_json")
        .eq("signature", signature)
        .eq("version", 1)
        .maybeSingle();
      template = templateData;
    } catch (error) {
      // plan_template table might not exist yet, continue with plan generation
      console.log("plan_template table not available, generating new plan");
    }

    if (template) {
      // Link a new user-owned goal to the template instantly (no AI call)
      const { data: goal, error } = await supabase
        .from("learning_goals")
        .insert({
          user_id: user.id,
          topic,
          focus,
          plan_version: 1,
          plan_json: template.plan_json,
          ...(template.id && { plan_template_id: template.id }),
        })
        .select("id, topic, focus, plan_version, created_at")
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ...goal, reused: true }, { status: 201 });
    }

    // 2) No template yet: generate with RAG + GPT
    const t0 = Date.now();
    
    // Check budget caps before AI call
    await checkCapsOrThrow(user.id, "planner");
    
    const msgs = await buildPlannerPromptWithRAG(
      `Create a learning plan for ${topic}${focus ? ` focusing on ${focus}` : ""}`,
      topic,
      6
    );
    
    const { data: planResult, usage } = await generatePlan(msgs, user.id);
    const plan_json = planResult;
    
    // Log the AI call
    const latency_ms = Date.now() - t0;
    const cost_usd = usage ? (usage.prompt_tokens * 0.00015/1000 + usage.completion_tokens * 0.0006/1000) : 0;
    
    await logCall({
      user_id: user.id,
      endpoint: "planner",
      model: "gpt-5-mini", // or get from usage
      prompt_tokens: usage?.prompt_tokens || 0,
      completion_tokens: usage?.completion_tokens || 0,
      success: true,
      latency_ms,
      cost_usd,
    });

    // Save template for future reuse
    let newTemplate: { id: string } | null = null;
    try {
      const { data: templateData, error: tErr } = await supabase
        .from("plan_template")
        .insert({
          signature,
          topic,
          focus,
          level: level || profile?.level || null,
          minutes_per_day: minutes_per_day || profile?.minutes_per_day || null,
          locale: profile?.tz || "en",
          version: 1,
          plan_json,
        })
        .select("id")
        .single();

      if (tErr) {
        // If conflict due to race, re-query and continue
        const { data: t2 } = await supabase
          .from("plan_template")
          .select("id")
          .eq("signature", signature)
          .eq("version", 1)
          .maybeSingle();
        if (t2) newTemplate = t2;
      } else {
        newTemplate = templateData;
      }
    } catch (error) {
      // plan_template table might not exist yet, continue without caching
      console.log("plan_template table not available, skipping template caching");
    }

    const { data: goal, error: gErr } = await supabase
      .from("learning_goals")
      .insert({
        user_id: user.id,
        topic,
        focus,
        plan_version: 1,
        plan_json,
        ...(newTemplate?.id && { plan_template_id: newTemplate.id }),
      })
      .select("id, topic, focus, plan_version, created_at")
      .single();

    if (gErr) return NextResponse.json({ error: gErr.message }, { status: 400 });
    return NextResponse.json({ ...goal, reused: false }, { status: 201 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error in POST /api/goals";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 