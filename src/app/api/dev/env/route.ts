import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function GET() {
  const env = {
    has_OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    OPENAI_API_KEY_length: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
    OPENAI_API_KEY_prefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 7) + "..." : null,
    OPENAI_MODEL_PLANNER: process.env.OPENAI_MODEL_PLANNER || null,
    OPENAI_MODEL_LESSON: process.env.OPENAI_MODEL_LESSON || null,
    OPENAI_MODEL_VALIDATOR: process.env.OPENAI_MODEL_VALIDATOR || null,
    node_env: process.env.NODE_ENV || null,
    supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabase_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
  return NextResponse.json(env);
} 