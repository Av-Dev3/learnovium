import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    // Simple test response first
    console.log("AI metrics API called");
    
    // Test if we can even get here
    if (request.url.includes('test')) {
      return NextResponse.json({ 
        message: "AI metrics API is working", 
        timestamp: new Date().toISOString() 
      });
    }
    
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

    // Get all AI call logs
    const { data: aiCalls, error: aiCallsError } = await supabase
      .from("ai_call_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (aiCallsError) {
      console.error("Error fetching AI calls:", aiCallsError);
    }

    // Get daily spend data
    const { data: dailySpend, error: dailySpendError } = await supabase
      .from("ai_daily_user_spend")
      .select("*")
      .order("date", { ascending: false })
      .limit(100);

    if (dailySpendError) {
      console.error("Error fetching daily spend:", dailySpendError);
    }

    // Get global spend data
    const { data: globalSpend, error: globalSpendError } = await supabase
      .from("ai_daily_global_spend")
      .select("*")
      .order("date", { ascending: false })
      .limit(100);

    if (globalSpendError) {
      console.error("Error fetching global spend:", globalSpendError);
    }

    // Get admin config
    const { data: adminConfig, error: adminConfigError } = await supabase
      .from("admin_config")
      .select("*")
      .eq("id", 1)
      .single();

    if (adminConfigError) {
      console.error("Error fetching admin config:", adminConfigError);
    }

    // Calculate summary statistics
    const totalCost = aiCalls?.reduce((sum, call) => sum + (call.cost_usd || 0), 0) || 0;
    const totalCalls = aiCalls?.length || 0;
    const successCalls = aiCalls?.filter(call => call.success).length || 0;
    const errorCalls = aiCalls?.filter(call => !call.success).length || 0;
    
    // Group by endpoint
    const endpointStats = aiCalls?.reduce((acc, call) => {
      const endpoint = call.endpoint || 'unknown';
      if (!acc[endpoint]) {
        acc[endpoint] = { calls: 0, cost: 0, errors: 0 };
      }
      acc[endpoint].calls++;
      acc[endpoint].cost += call.cost_usd || 0;
      if (!call.success) acc[endpoint].errors++;
      return acc;
    }, {} as Record<string, { calls: number; cost: number; errors: number }>) || {};

    // Group by model
    const modelStats = aiCalls?.reduce((acc, call) => {
      const model = call.model || 'unknown';
      if (!acc[model]) {
        acc[model] = { calls: 0, cost: 0, tokens: 0 };
      }
      acc[model].calls++;
      acc[model].cost += call.cost_usd || 0;
      acc[model].tokens += (call.prompt_tokens || 0) + (call.completion_tokens || 0);
      return acc;
    }, {} as Record<string, { calls: number; cost: number; tokens: number }>) || {};

    // Recent activity (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const recentCalls = aiCalls?.filter(call => 
      new Date(call.created_at) > yesterday
    ) || [];

    const response = {
      summary: {
        total_cost_usd: totalCost,
        total_calls: totalCalls,
        success_calls: successCalls,
        error_calls: errorCalls,
        recent_24h_calls: recentCalls.length,
        recent_24h_cost: recentCalls.reduce((sum, call) => sum + (call.cost_usd || 0), 0)
      },
      endpoint_stats: endpointStats,
      model_stats: modelStats,
      daily_spend: dailySpend || [],
      global_spend: globalSpend || [],
      admin_config: adminConfig || {},
      recent_calls: aiCalls?.slice(0, 50) || [], // Last 50 calls
      timestamp: new Date().toISOString()
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
