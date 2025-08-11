import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function GET() {
  const env = {
    has_OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    OPENAI_MODEL_PLANNER: process.env.OPENAI_MODEL_PLANNER || null,
    OPENAI_MODEL_LESSON: process.env.OPENAI_MODEL_LESSON || null,
    OPENAI_MODEL_VALIDATOR: process.env.OPENAI_MODEL_VALIDATOR || null,
    node_env: process.env.NODE_ENV || null,
  };
  return NextResponse.json(env);
} 