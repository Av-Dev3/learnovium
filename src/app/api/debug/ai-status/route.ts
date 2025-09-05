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
    
    // Check recent AI call logs with detailed error parsing
    const { data: recentCalls, error: logsError } = await supabase
      .from("ai_call_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    // Check if we have any fallback calls
    const { data: fallbackCalls, error: fallbackError } = await supabase
      .from("ai_call_log")
      .select("*")
      .eq("model", "fallback")
      .order("created_at", { ascending: false })
      .limit(10);

    // Parse and format the error details for better readability
    const formatCallDetails = (calls: Record<string, unknown>[]) => {
      return calls?.map(call => {
        let parsedError: unknown = null;
        if (call.error_text) {
          try {
            parsedError = JSON.parse(call.error_text as string);
          } catch {
            parsedError = call.error_text;
          }
        }

        return {
          id: call.id,
          created_at: call.created_at,
          endpoint: call.endpoint,
          model: call.model,
          success: call.success,
          latency_ms: call.latency_ms,
          tokens: {
            prompt: call.prompt_tokens,
            completion: call.completion_tokens,
            total: call.total_tokens
          },
          cost_usd: call.cost_usd,
          error_details: parsedError,
          raw_error: call.error_text
        };
      }) || [];
    };

    const formattedRecentCalls = formatCallDetails(recentCalls || []);
    const formattedFallbackCalls = formatCallDetails(fallbackCalls || []);

    // Get summary stats
    const totalCalls = recentCalls?.length || 0;
    const successfulCalls = recentCalls?.filter(call => call.success)?.length || 0;
    const failedCalls = totalCalls - successfulCalls;

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: {
        hasOpenAIKey,
        openAIKeyLength,
        nodeEnv: process.env.NODE_ENV,
      },
      summary: {
        totalRecentCalls: totalCalls,
        successfulCalls,
        failedCalls,
        successRate: totalCalls > 0 ? `${Math.round((successfulCalls / totalCalls) * 100)}%` : "N/A"
      },
      recentCalls: formattedRecentCalls,
      fallbackCalls: formattedFallbackCalls,
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
