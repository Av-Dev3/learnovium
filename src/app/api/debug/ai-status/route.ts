import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { user, supabase } = await requireUser(req);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check environment variables
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    const openAIKeyLength = process.env.OPENAI_API_KEY?.length || 0;
    
    // Check recent AI call logs
    const { data: recentCalls, error: logsError } = await supabase
      .from("ai_call_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    // Check if we have any fallback calls
    const { data: fallbackCalls, error: fallbackError } = await supabase
      .from("ai_call_log")
      .select("*")
      .eq("model", "fallback")
      .order("created_at", { ascending: false })
      .limit(5);

    return NextResponse.json({
      environment: {
        hasOpenAIKey,
        openAIKeyLength,
        nodeEnv: process.env.NODE_ENV,
      },
      recentCalls: recentCalls || [],
      fallbackCalls: fallbackCalls || [],
      errors: {
        logsError: logsError?.message,
        fallbackError: fallbackError?.message,
      }
    });

  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json({ 
      error: "Debug failed", 
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
