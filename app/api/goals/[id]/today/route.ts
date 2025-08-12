import { NextRequest, NextResponse } from "next/server";
import { requireUser, dayIndexFrom } from "@/lib/api/utils";
import { retrieveContext } from "@/rag/retriever";
import { generateLesson } from "@/lib/aiCall";
import { buildLessonPrompt } from "@/lib/prompts";

export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, supabase, res } = await requireUser(req);
  if (!user) return res!;
  const goalId = params.id;

  // 1) Get the goal (RLS ensures user owns it)
  const { data: goal, error: gErr } = await supabase
    .from("learning_goals")
    .select("id, topic, focus, created_at")
    .eq("id", goalId)
    .single();
  if (gErr || !goal) return NextResponse.json({ error: "Goal not found" }, { status: 404 });

  // 2) Compute day index
  const dayIndex = dayIndexFrom(goal.created_at || new Date().toISOString());

  // 3) Check cache in lesson_log
  const { data: existing } = await supabase
    .from("lesson_log")
    .select("id, lesson_json")
    .eq("user_id", user.id).eq("goal_id", goalId).eq("day_index", dayIndex)
    .maybeSingle();

  if (existing?.lesson_json) {
    return NextResponse.json(existing.lesson_json);
  }

  // 4) Build RAG context and prompt
  const query = `${goal.topic} — ${goal.focus || "beginner daily lesson"}`;
  const { context } = await retrieveContext(query, 5, goal.topic);
  const msgs = buildLessonPrompt(`Today's focus: ${goal.focus || goal.topic}. Use this context:\n${context}`);

  // 5) Generate lesson
  const { data: lesson } = await generateLesson(msgs);

  // 6) Write to lesson_log (RLS: user_id must be provided)
  await supabase.from("lesson_log").insert({
    user_id: user.id,
    goal_id: goalId,
    day_index: dayIndex,
    chunk_ids: [],            // optional: you can thread RAG chunk ids if you want
    model: process.env.OPENAI_MODEL_LESSON || "gpt-5-mini",
    citations: lesson.citations || [],
    lesson_json: lesson,
  });

  return NextResponse.json(lesson);
} 