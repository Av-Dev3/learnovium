import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

interface AICallSummary {
  cost_usd: number;
  success: boolean;
  endpoint: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  created_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
      
    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get query parameters for filtering and pagination
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const endpoint = url.searchParams.get('endpoint');
    const success = url.searchParams.get('success');
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');

    // Check if ai_call_log table exists first
    let tableExists = true;
    let aiCalls: unknown[] = [];
    
    try {
      // Test if table exists by doing a simple count
      const { error: countError } = await supabase
        .from("ai_call_log")
        .select("*", { count: "exact", head: true });
      
      if (countError) {
        console.log("ai_call_log table check failed:", countError);
        tableExists = false;
      }
    } catch (error) {
      console.log("ai_call_log table doesn't exist:", error);
      tableExists = false;
    }

    if (tableExists) {
      // Build query for AI call logs
      let query = supabase
        .from("ai_call_log")
        .select(`
          *,
          profiles(email)
        `)
        .order("created_at", { ascending: false });

      // Apply filters
      if (endpoint) {
        query = query.eq("endpoint", endpoint);
      }
      if (success !== null && success !== undefined) {
        query = query.eq("success", success === 'true');
      }
      if (startDate) {
        query = query.gte("created_at", startDate);
      }
      if (endDate) {
        query = query.lte("created_at", endDate);
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data: calls, error: aiCallsError } = await query;
      
      if (aiCallsError) {
        console.error("Error fetching AI calls:", aiCallsError);
      } else {
        aiCalls = calls || [];
      }
    }

    // Get summary statistics (only if table exists)
    let summaryData: AICallSummary[] = [];
    if (tableExists) {
      const { data: summary, error: summaryError } = await supabase
        .from("ai_call_log")
        .select("cost_usd, success, endpoint, model, prompt_tokens, completion_tokens, created_at");

      if (summaryError) {
        console.error("Error fetching summary data:", summaryError);
      } else {
        summaryData = summary || [];
      }
    }

    // Calculate detailed summary statistics
    const totalCost = summaryData?.reduce((sum, call) => sum + (call.cost_usd || 0), 0) || 0;
    const totalCalls = summaryData?.length || 0;
    const successCalls = summaryData?.filter(call => call.success).length || 0;
    const errorCalls = summaryData?.filter(call => !call.success).length || 0;
    const totalTokens = summaryData?.reduce((sum, call) => sum + (call.prompt_tokens || 0) + (call.completion_tokens || 0), 0) || 0;
    const totalPromptTokens = summaryData?.reduce((sum, call) => sum + (call.prompt_tokens || 0), 0) || 0;
    const totalCompletionTokens = summaryData?.reduce((sum, call) => sum + (call.completion_tokens || 0), 0) || 0;
    
    // Separate embeddings from chat completions
    const embeddingsData = summaryData?.filter(call => call.endpoint === 'embeddings') || [];
    const chatData = summaryData?.filter(call => call.endpoint !== 'embeddings') || [];
    
    const embeddingsCost = embeddingsData.reduce((sum, call) => sum + (call.cost_usd || 0), 0);
    const embeddingsTokens = embeddingsData.reduce((sum, call) => sum + (call.prompt_tokens || 0), 0);
    const embeddingsCalls = embeddingsData.length;
    
    const chatCost = chatData.reduce((sum, call) => sum + (call.cost_usd || 0), 0);
    const chatPromptTokens = chatData.reduce((sum, call) => sum + (call.prompt_tokens || 0), 0);
    const chatCompletionTokens = chatData.reduce((sum, call) => sum + (call.completion_tokens || 0), 0);
    const chatCalls = chatData.length;
    
    // Group by endpoint with detailed breakdown
    const endpointStats = summaryData?.reduce((acc, call) => {
      const endpoint = call.endpoint || 'unknown';
      if (!acc[endpoint]) {
        acc[endpoint] = { 
          calls: 0, 
          cost: 0, 
          errors: 0, 
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        };
      }
      acc[endpoint].calls++;
      acc[endpoint].cost += call.cost_usd || 0;
      acc[endpoint].prompt_tokens += call.prompt_tokens || 0;
      acc[endpoint].completion_tokens += call.completion_tokens || 0;
      acc[endpoint].total_tokens += (call.prompt_tokens || 0) + (call.completion_tokens || 0);
      if (!call.success) acc[endpoint].errors++;
      return acc;
    }, {} as Record<string, { 
      calls: number; 
      cost: number; 
      errors: number; 
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    }>) || {};

    // Group by model with detailed breakdown
    const modelStats = summaryData?.reduce((acc, call) => {
      const model = call.model || 'unknown';
      if (!acc[model]) {
        acc[model] = { 
          calls: 0, 
          cost: 0, 
          prompt_tokens: 0, 
          completion_tokens: 0,
          total_tokens: 0,
          success_rate: 0
        };
      }
      acc[model].calls++;
      acc[model].cost += call.cost_usd || 0;
      acc[model].prompt_tokens += call.prompt_tokens || 0;
      acc[model].completion_tokens += call.completion_tokens || 0;
      acc[model].total_tokens += (call.prompt_tokens || 0) + (call.completion_tokens || 0);
      
      // Calculate success rate
      const successfulCalls = summaryData?.filter(c => c.model === model && c.success).length || 0;
      acc[model].success_rate = Math.round((successfulCalls / acc[model].calls) * 100);
      
      return acc;
    }, {} as Record<string, { 
      calls: number; 
      cost: number; 
      prompt_tokens: number; 
      completion_tokens: number;
      total_tokens: number;
      success_rate: number;
    }>) || {};

    // Recent activity (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const recentCalls = summaryData?.filter(call => 
      new Date(call.created_at) > yesterday
    ) || [];

    const response = {
      calls: aiCalls || [],
      table_exists: tableExists,
      message: tableExists ? undefined : "AI call logging table not found. No AI metrics data available yet.",
      pagination: {
        limit,
        offset,
        total: totalCalls,
        hasMore: (aiCalls?.length || 0) === limit
      },
      summary: {
        total_cost_usd: totalCost,
        total_calls: totalCalls,
        success_calls: successCalls,
        error_calls: errorCalls,
        success_rate: totalCalls > 0 ? Math.round((successCalls / totalCalls) * 100) : 0,
        total_tokens: totalTokens,
        total_prompt_tokens: totalPromptTokens,
        total_completion_tokens: totalCompletionTokens,
        avg_cost_per_call: totalCalls > 0 ? totalCost / totalCalls : 0,
        recent_24h_calls: recentCalls.length,
        recent_24h_cost: recentCalls.reduce((sum, call) => sum + (call.cost_usd || 0), 0)
      },
      detailed_breakdown: {
        embeddings: {
          calls: embeddingsCalls,
          cost_usd: embeddingsCost,
          tokens: embeddingsTokens,
          avg_cost_per_call: embeddingsCalls > 0 ? embeddingsCost / embeddingsCalls : 0
        },
        chat_completions: {
          calls: chatCalls,
          cost_usd: chatCost,
          prompt_tokens: chatPromptTokens,
          completion_tokens: chatCompletionTokens,
          total_tokens: chatPromptTokens + chatCompletionTokens,
          avg_cost_per_call: chatCalls > 0 ? chatCost / chatCalls : 0
        }
      },
      endpoint_stats: endpointStats,
      model_stats: modelStats,
      filters: {
        endpoint,
        success,
        start_date: startDate,
        end_date: endDate
      },
      timestamp: new Date().toISOString(),
      notes: [
        "Embeddings are tracked separately from chat completions",
        "Costs include both input and output tokens where applicable",
        "Some system-level calls may not have user_id associated",
        "Compare with OpenAI dashboard for complete usage tracking"
      ]
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("AI metrics error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
