import { NextResponse } from "next/server";
import { buildLessonPrompt } from "@/lib/prompts";
import { generateLesson } from "@/lib/aiCall";

export const runtime = "nodejs";

export async function GET() {
  const ctx = `Today's focus: Strumming patterns for absolute beginners. Cite 1-2 sources.`;
  const msgs = buildLessonPrompt(ctx);
  const { data } = await generateLesson(msgs);
  return NextResponse.json(data);
} 