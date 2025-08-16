/**
 * Admin Metrics Summary API
 * GET /api/admin/metrics/summary
 */

import { NextResponse } from "next/server";
import { withAdminGuard } from "../../_guard";
import { createClient } from "@supabase/supabase-js";
import { getAdminConfigSR } from "@/lib/adminConfig";

function getServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

async function handleSummary() {
  try {
    const supabase = getServiceRoleClient();
    const today = new Date().toISOString().split('T')[0];

    // Get overall summary for today
    const { data: summary } = await supabase
      .from("v_ai_spend_summary")
      .select("*")
      .single();

    // Get admin configuration
    const config = await getAdminConfigSR();

    // Get breakdown by endpoint for today
    const { data: endpointBreakdown } = await supabase
      .from("ai_call_log")
      .select("endpoint, success, cost_usd, latency_ms")
      .gte("created_at", `${today}T00:00:00Z`)
      .lt("created_at", `${today}T23:59:59Z`);

    // Process endpoint breakdown
    const endpoints = endpointBreakdown?.reduce((acc, call) => {
      const { endpoint, success, cost_usd, latency_ms } = call;
      
      if (!acc[endpoint]) {
        acc[endpoint] = {
          endpoint,
          total_calls: 0,
          success_calls: 0,
          error_calls: 0,
          total_cost_usd: 0,
          avg_latency_ms: 0,
          latencies: [] as number[],
        };
      }
      
      acc[endpoint].total_calls++;
      acc[endpoint].total_cost_usd += cost_usd || 0;
      acc[endpoint].latencies.push(latency_ms || 0);
      
      if (success) {
        acc[endpoint].success_calls++;
      } else {
        acc[endpoint].error_calls++;
      }
      
      return acc;
    }, {} as Record<string, {
      endpoint: string;
      total_calls: number;
      success_calls: number;
      error_calls: number;
      total_cost_usd: number;
      avg_latency_ms: number;
      latencies: number[];
    }>) || {};

    // Calculate average latencies and format for response
    const formattedEndpoints = Object.values(endpoints).map((ep) => {
      if (ep.latencies.length > 0) {
        ep.avg_latency_ms = ep.latencies.reduce((a: number, b: number) => a + b, 0) / ep.latencies.length;
      }
      // Return endpoint without latencies array
      return {
        endpoint: ep.endpoint,
        total_calls: ep.total_calls,
        success_calls: ep.success_calls,
        error_calls: ep.error_calls,
        total_cost_usd: ep.total_cost_usd,
        avg_latency_ms: ep.avg_latency_ms,
      };
    });

    // Get current usage vs budgets
    const { data: globalSpend } = await supabase
      .from("ai_daily_global_spend")
      .select("total_cost_usd")
      .eq("day", today)
      .single();

    const response = {
      summary: summary || {
        day: today,
        total_calls: 0,
        success_calls: 0,
        error_calls: 0,
        total_cost_usd: 0,
        avg_latency_ms: 0,
      },
      config: {
        daily_user_budget_usd: config.daily_user_budget_usd,
        daily_global_budget_usd: config.daily_global_budget_usd,
        disable_endpoints: config.disable_endpoints,
      },
      endpoints: formattedEndpoints,
      budget_status: {
        global_spent: globalSpend?.total_cost_usd || 0,
        global_limit: config.daily_global_budget_usd,
        global_remaining: Math.max(0, config.daily_global_budget_usd - (globalSpend?.total_cost_usd || 0)),
        global_percent_used: Math.min(100, ((globalSpend?.total_cost_usd || 0) / config.daily_global_budget_usd) * 100),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching metrics summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics summary" },
      { status: 500 }
    );
  }
}

export const GET = withAdminGuard(handleSummary);
