import { NextRequest, NextResponse } from "next/server";
import { requireUser, dayIndexFrom } from "@/lib/api/utils";
import { retrieveContext } from "@/rag/retriever";
import { generateLesson } from "@/lib/aiCall";
import { buildLessonPrompt } from "@/lib/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user, supabase, res } = await requireUser(req);
    if (!user) return res!;
    const { id: goalId } = await params;

    const { data: goal, error: gErr } = await supabase
      .from("learning_goals")
      .select("id, topic, focus, created_at")
      .eq("id", goalId)
      .single();
    if (gErr || !goal) return NextResponse.json({ error: "Goal not found" }, { status: 404 });

    const dayIndex = dayIndexFrom(goal.created_at || new Date().toISOString());

    const { data: existing } = await supabase
      .from("lesson_log")
      .select("id, lesson_json")
      .eq("user_id", user.id).eq("goal_id", goalId).eq("day_index", dayIndex)
      .maybeSingle();
    if (existing?.lesson_json) return NextResponse.json(existing.lesson_json);

    const query = `${goal.topic} — ${goal.focus || "beginner daily lesson"}`;
    const { context } = await retrieveContext(query, 5, goal.topic);
    const msgs = buildLessonPrompt(`Today's focus: ${goal.focus || goal.topic}. Use this context:\n${context}`);
    const { data: lesson } = await generateLesson(msgs);

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

    return NextResponse.json(lesson);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error in GET /today";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 