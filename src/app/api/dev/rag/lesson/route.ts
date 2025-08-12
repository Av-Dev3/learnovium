import { NextResponse } from "next/server";
import { buildLessonPromptWithRAG } from "@/lib/prompts";
import { generateLesson } from "@/lib/aiCall";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic") || "Python";
  const query = searchParams.get("q") || "Lists vs tuples, beginner level";
  const msgs = await buildLessonPromptWithRAG(query, topic, 5);
  const { data } = await generateLesson(msgs);
  return NextResponse.json(data);
} 