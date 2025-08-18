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
    if (!user) {
      console.log("GET /api/goals - no user found");
      return res!;
    }
    
    console.log("GET /api/goals - user:", user.id);
    console.log("GET /api/goals - user email:", user.email);
    
    // Check if the learning_goals table exists and has data
    const { data: tableCheck, error: tableError } = await supabase
      .from("learning_goals")
      .select("count", { count: "exact", head: true });
    
    console.log("GET /api/goals - table check:", { tableCheck, tableError });
    
    const { data, error } = await supabase
      .from("learning_goals")
      .select("id, topic, focus, plan_version, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("GET /api/goals - Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    console.log("GET /api/goals - data:", data);
    console.log("GET /api/goals - data type:", typeof data);
    console.log("GET /api/goals - is array:", Array.isArray(data));
    console.log("GET /api/goals - data length:", data?.length);
    
    return NextResponse.json(data ?? []);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error in GET /api/goals";
    console.error("GET /api/goals - caught error:", e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/goals — create a new goal with template caching
export async function POST(req: NextRequest) {
  try {
    console.log("POST /api/goals - incoming request");
    const { user, supabase, res } = await requireUser(req);
    if (!user) {
      console.log("POST /api/goals - no user found");
      return res!;
    }
    console.log("POST /api/goals - user:", user.id);
    
    const body = await req.json().catch(() => ({}));
    const { topic, focus, level, minutes_per_day, duration_days } = body || {};
    console.log("POST /api/goals - body:", { topic, focus, level, minutes_per_day, duration_days });
    if (!topic) return NextResponse.json({ error: "Missing topic" }, { status: 400 });

    // Pull profile to build signature
    // Temporarily disabled while setting up database migrations
    /*
    const { data: profile } = await supabase
      .from("profiles")
      .select("level, minutes_per_day, tz")
      .eq("id", user.id)
      .maybeSingle();
    */

    const signature = await canonicalizeSignature({
      topic,
      focus,
      level: level || 'beginner', // Temporarily use default values
      minutes_per_day: minutes_per_day || 30, // Temporarily use default values
      duration_days: duration_days || null,
      locale: 'en', // Temporarily use default values
      version: 1,
    });

    // 1) Try to reuse existing plan_template
    const template = null;
    try {
      // Temporarily disabled while setting up database migrations
      /*
      const { data: templateData } = await supabase
        .from("plan_template")
        .select("id, plan_json")
        .eq("signature", signature)
        .eq("version", 1)
        .maybeSingle();
      template = templateData;
      console.log("POST /api/goals - template found:", Boolean(template));
      */
    } catch (error) {
      // plan_template table might not exist yet, continue with plan generation
      console.log("plan_template table not available, generating new plan");
    }

    if (template) {
      // Link a new user-owned goal to the template instantly (no AI call)
      // Temporarily disabled while setting up database migrations
      /*
      const { data: goal, error } = await supabase
        .from("learning_goals")
        .insert({
          user_id: user.id,
          topic,
          focus,
          level,
          plan_version: 1,
          plan_json: template.plan_json,
          ...(template.id && { plan_template_id: template.id }),
        })
        .select("id, topic, focus, plan_version, created_at")
        .single();

      if (error) {
        console.error("POST /api/goals - insert (reuse) error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      console.log("POST /api/goals - goal created (reuse):", goal?.id);
      return NextResponse.json({ ...goal, reused: true }, { status: 201 });
      */
    }

    // 2) No template yet: generate with RAG + GPT
    const t0 = Date.now();
    
    // Check budget caps before AI call
    // Temporarily disabled while setting up database migrations
    // await checkCapsOrThrow(user.id, "planner");
    
    let plan_json;
    try {
      console.log("POST /api/goals - Starting AI plan generation...");
      const duration = (duration_days as number) || 7;
      const userLevel = level || 'beginner';
      console.log("POST /api/goals - Building RAG prompt...");
      const msgs = await buildPlannerPromptWithRAG(
        `Create a ${duration}-day ${userLevel} level learning plan for ${topic}${focus ? ` focusing on ${focus}` : ""}. The plan must strictly have total_days=${duration} and be appropriate for ${userLevel} level students.`,
        topic,
        8
      );
      
      console.log("POST /api/goals - Calling OpenAI...");
      const { data: planResult, usage } = await generatePlan(msgs, user.id);
      console.log("POST /api/goals - OpenAI response received:", { planResult, usage });
      // Force total_days to requested duration if model deviates
      plan_json = { ...planResult, total_days: duration };
      
      // Log the AI call
      const latency_ms = Date.now() - t0;
      const cost_usd = usage ? (usage.prompt_tokens * 0.00015/1000 + usage.completion_tokens * 0.0006/1000) : 0;
      
      console.log("POST /api/goals - AI generation successful:", { latency_ms, cost_usd });
      
      // Temporarily disabled while setting up database migrations
      /*
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
      */
    } catch (error) {
      console.error("POST /api/goals - AI plan generation failed:", error);
      
      // Create a fallback plan structure
      const userLevel = level || 'beginner';
      plan_json = {
        version: "1",
        topic: topic,
        total_days: 7,
        modules: [
          {
            title: `${topic} ${userLevel.charAt(0).toUpperCase() + userLevel.slice(1)} Fundamentals`,
            days: [
              {
                day_index: 1,
                topic: `${userLevel.charAt(0).toUpperCase() + userLevel.slice(1)} Introduction to ${topic}`,
                objective: `Understand the ${userLevel} level basics of ${topic}`,
                practice: `Review fundamental ${userLevel} level concepts`,
                assessment: `${userLevel} level self-assessment quiz`,
                est_minutes: Math.min(minutes_per_day || 30, 60)
              }
            ]
          }
        ],
        citations: [`${topic} learning resources`]
      };
      
      console.log("POST /api/goals - Using fallback plan:", plan_json);
      
      // Log the fallback
      const latency_ms = Date.now() - t0;
      // Temporarily disabled while setting up database migrations
      /*
      await logCall({
        user_id: user.id,
        endpoint: "planner",
        model: "fallback",
        prompt_tokens: 0,
        completion_tokens: 0,
        success: false,
        latency_ms,
        cost_usd: 0,
        error_text: error instanceof Error ? error.message : "Unknown error"
      });
      */
    }

    // Save template for future reuse
    const newTemplate: { id: string } | null = null;
    try {
      // Temporarily disabled while setting up database migrations
      /*
      const { data: templateData, error: tErr } = await supabase
        .from("plan_template")
        .insert({
          signature,
          topic,
          focus,
          level: level || profile?.level || null,
          minutes_per_day: minutes_per_day || profile?.minutes_per_day || null,
          duration_days: duration_days || null,
          plan_json,
          locale: profile?.tz || "en",
          version: 1,
        })
        .select("id")
        .single();

      if (tErr) {
        // If conflict due to race, re-query and continue
        console.warn("POST /api/goals - template insert error, will re-query:", tErr?.message);
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
      */
    } catch (error) {
      // plan_template table might not exist yet, continue without caching
      console.log("plan_template table not available, skipping template caching");
    }

    console.log("POST /api/goals - About to insert goal into database...");
    console.log("POST /api/goals - Insert data:", {
      user_id: user.id,
      topic,
      focus,
      level,
      plan_version: 1,
      plan_json: typeof plan_json,
      plan_json_keys: plan_json ? Object.keys(plan_json) : 'null'
    });

    const { data: goal, error: gErr } = await supabase
      .from("learning_goals")
      .insert({
        user_id: user.id,
        topic,
        focus,
        level,
        plan_version: 1,
        plan_json,
        // Temporarily disabled while setting up database migrations
        // ...(newTemplate?.id && { plan_template_id: newTemplate.id }),
      })
      .select("id, topic, focus, plan_version, created_at")
      .single();

    if (gErr) {
      console.error("POST /api/goals - insert (new) error:", gErr);
      console.error("POST /api/goals - Error details:", {
        code: gErr.code,
        message: gErr.message,
        details: gErr.details,
        hint: gErr.hint
      });
      return NextResponse.json({ error: gErr.message }, { status: 400 });
    }
    
    console.log("POST /api/goals - Goal created successfully:", goal);
    console.log("POST /api/goals - goal created (new):", goal?.id);
    return NextResponse.json({ ...goal, reused: false }, { status: 201 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error in POST /api/goals";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 