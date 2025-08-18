import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { canonicalizeSignature } from "@/lib/goalSignature";
import { buildPlannerPromptWithRAG } from "@/lib/prompts";
import { generatePlan } from "@/lib/aiCall";

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
      .eq("user_id", user.id)
      .maybeSingle();

    const signature = canonicalizeSignature({
      topic,
      focus,
      level: level || profile?.level || null,
      minutes_per_day: minutes_per_day || profile?.minutes_per_day || null,
      locale: profile?.tz || "en",
      version: 1,
    });

    // 1) Try to reuse existing plan_template
    const { data: template } = await supabase
      .from("plan_template")
      .select("id, plan_json")
      .eq("signature", signature)
      .eq("version", 1)
      .maybeSingle();

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
          plan_template_id: template.id,
        })
        .select("id, topic, focus, plan_version, created_at")
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ...goal, reused: true }, { status: 201 });
    }

    // 2) No template yet: generate with RAG + GPT
    const msgs = await buildPlannerPromptWithRAG(
      `Create a learning plan for ${topic}${focus ? ` focusing on ${focus}` : ""}`,
      topic,
      6
    );
    
    const { data: planResult } = await generatePlan(msgs, user.id);
    const plan_json = planResult;

    // Save template for future reuse
    const { data: newTemplate, error: tErr } = await supabase
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
      if (t2) newTemplate = t2 as any;
    }

    const { data: goal, error: gErr } = await supabase
      .from("learning_goals")
      .insert({
        user_id: user.id,
        topic,
        focus,
        plan_version: 1,
        plan_json,
        plan_template_id: (newTemplate as any)?.id ?? null,
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