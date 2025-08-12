import { NextResponse } from "next/server";
import { buildPlannerPromptWithRAG } from "@/lib/prompts";
import { generatePlan } from "@/lib/aiCall";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic") || "Python";
  const query = searchParams.get("q") || "Beginner Python 2-week plan focusing on practical tasks";
  const msgs = await buildPlannerPromptWithRAG(query, topic, 6);
  const { data } = await generatePlan(msgs);
  return NextResponse.json(data);
} 