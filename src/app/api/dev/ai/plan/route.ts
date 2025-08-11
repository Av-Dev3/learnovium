import { NextResponse } from "next/server";
import { buildPlannerPrompt } from "@/lib/prompts";
import { generatePlan } from "@/lib/aiCall";

export const runtime = "nodejs";

export async function GET() {
  const ctx = `Topic: Beginner Guitar Chords. Duration: 7 days. Sources: JustinGuitar.`;
  const msgs = buildPlannerPrompt(ctx);
  const { data } = await generatePlan(msgs);
  return NextResponse.json(data);
} 