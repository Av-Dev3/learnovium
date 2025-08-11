import { NextResponse } from "next/server";
import { buildPlannerPrompt } from "@/lib/prompts";
import { generatePlan } from "@/lib/aiCall";

export const runtime = "nodejs";

export async function GET() {
  try {
    const ctx = `Topic: Beginner Guitar Chords. Duration: 7 days. Sources: JustinGuitar.`;
    const msgs = buildPlannerPrompt(ctx);
    const { data } = await generatePlan(msgs);
    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("PLAN_ERROR", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(
      JSON.stringify({ error: true, message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
} 