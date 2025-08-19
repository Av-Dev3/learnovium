import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function GET() {
  interface EnvInfo {
    has_OPENAI_API_KEY: boolean;
    OPENAI_API_KEY_length: number;
    OPENAI_API_KEY_prefix: string | null;
    has_SUPABASE_URL: boolean;
    has_SUPABASE_ANON_KEY: boolean;
    has_SUPABASE_SERVICE_KEY: boolean;
    supabase_url: boolean;
    supabase_anon_key: boolean;
    supabase_service_key: boolean;
    db_tables?: string[];
    db_error?: string;
  }

  const env: EnvInfo = {
    has_OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    OPENAI_API_KEY_length: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
    OPENAI_API_KEY_prefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 7) + "..." : null,
    has_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    has_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    has_SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabase_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  // Check database tables
  try {
    const supabase = await import("@/lib/supabaseServer").then(m => m.supabaseServer());
    
    // Check if key tables exist
    const tables = [];
    
    try {
      const { data: goals } = await supabase.from("learning_goals").select("count").limit(1);
      tables.push("learning_goals ✓");
    } catch (e) {
      tables.push("learning_goals ✗");
    }
    
    try {
      const { data: lessonLog } = await supabase.from("lesson_log").select("count").limit(1);
      tables.push("lesson_log ✓");
    } catch (e) {
      tables.push("lesson_log ✗");
    }
    
    try {
      const { data: lessonTemplate } = await supabase.from("lesson_template").select("count").limit(1);
      tables.push("lesson_template ✓");
    } catch (e) {
      tables.push("lesson_template ✗");
    }
    
    env.db_tables = tables;
  } catch (error) {
    env.db_error = `Database connection failed: ${error}`;
  }

  return NextResponse.json(env);
} 