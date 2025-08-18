import { NextRequest, NextResponse } from "next/server";
import { requireUser, dayIndexFrom } from "@/lib/api/utils";
import { retrieveContextDB } from "@/rag/retriever_db";
import { generateLesson } from "@/lib/aiCall";
import { buildLessonPrompt } from "@/lib/prompts";
import { checkCapsOrThrow, logCall } from "@/lib/aiGuard";

const LIMIT_WINDOW_MS = 60_000;
declare global {
  var __todayRate: Map<string, number> | undefined;
}
function rateKey(userId: string, goalId: string) {
  return `${userId}:${goalId}`;
}
function checkRate(userId: string, goalId: string) {
  if (!globalThis.__todayRate) globalThis.__todayRate = new Map();
  const key = rateKey(userId, goalId);
  const now = Date.now();
  const last = globalThis.__todayRate.get(key) || 0;
  const delta = now - last;
  if (delta < LIMIT_WINDOW_MS) {
    return { ok: false, retry_ms: LIMIT_WINDOW_MS - delta };
  }
  globalThis.__todayRate.set(key, now);
  return { ok: true, retry_ms: 0 };
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user, supabase, res } = await requireUser(req);
    if (!user) return res!;
    const { id: goalId } = await params;

    const limit = checkRate(user.id, goalId);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many requests. Try again soon.", retry_ms: limit.retry_ms },
        { status: 429 }
      );
    }

    // Load goal & its plan_template link
    const { data: goal, error: gErr } = await supabase
      .from("learning_goals")
      .select("id, topic, focus, created_at, plan_template_id")
      .eq("id", goalId)
      .eq("user_id", user.id)
      .single();
    if (gErr || !goal) return NextResponse.json({ error: "Goal not found" }, { status: 404 });

    const dayIndex = dayIndexFrom(goal.created_at || new Date().toISOString());

    // If we have a template, try to reuse lesson
    if (goal.plan_template_id) {
      const { data: cached } = await supabase
        .from("lesson_template")
        .select("lesson_json")
        .eq("plan_template_id", goal.plan_template_id)
        .eq("day_index", dayIndex)
        .eq("version", 1)
        .maybeSingle();

      if (cached?.lesson_json) {
        return NextResponse.json({ reused: true, lesson: cached.lesson_json });
      }
    }

    // Check for existing user-specific lesson (fallback)
    const { data: existing } = await supabase
      .from("lesson_log")
      .select("id, lesson_json")
      .eq("user_id", user.id).eq("goal_id", goalId).eq("day_index", dayIndex)
      .maybeSingle();
    if (existing?.lesson_json) return NextResponse.json({ reused: false, lesson: existing.lesson_json });

    // Generate new lesson with RAG
    const t0 = Date.now();
    
    // Check budget caps before AI call
    await checkCapsOrThrow(user.id, "lesson");
    
    const query = `${goal.topic} — ${goal.focus || "beginner daily lesson"}`;
    const { context } = await retrieveContextDB(query, 5, goal.topic, req);
    const msgs = buildLessonPrompt(`Today's focus: ${goal.focus || goal.topic}. Use this context:\n${context}`);
    const { data: lesson, usage } = await generateLesson(msgs, user.id, goalId);
    
    // Log the AI call
    const latency_ms = Date.now() - t0;
    const cost_usd = usage ? (usage.prompt_tokens * 0.00015/1000 + usage.completion_tokens * 0.0006/1000) : 0;
    
    await logCall({
      user_id: user.id,
      goal_id: goalId,
      endpoint: "lesson",
      model: process.env.OPENAI_MODEL_LESSON || "gpt-5-mini",
      prompt_tokens: usage?.prompt_tokens || 0,
      completion_tokens: usage?.completion_tokens || 0,
      success: true,
      latency_ms,
      cost_usd,
    });

    // Write cache if template exists
    if (goal.plan_template_id) {
      await supabase.from("lesson_template").insert({
        plan_template_id: goal.plan_template_id,
        day_index: dayIndex,
        version: 1,
        model: process.env.OPENAI_MODEL_LESSON || "gpt-5-mini",
        lesson_json: lesson,
      }).select("id").maybeSingle();
    }

    // Also write to user-specific lesson_log for backward compatibility
    const { error: wErr } = await supabase.from("lesson_log").insert({
      user_id: user.id,
      goal_id: goalId,
      day_index: dayIndex,
      chunk_ids: null, // uuid[] column; we'll store null until we track actual chunk IDs
      model: process.env.OPENAI_MODEL_LESSON || "gpt-5-mini",
      citations: lesson.citations || [],  // jsonb array is OK
      lesson_json: lesson,                // <-- now exists and is jsonb
    });
    if (wErr) return NextResponse.json({ error: wErr.message }, { status: 400 });

    return NextResponse.json({ reused: false, lesson });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error in GET /today";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 