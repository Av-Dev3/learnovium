/**
 * Admin Toggles API
 * GET/POST /api/admin/toggles
 */

import { NextRequest, NextResponse } from "next/server";
import { withAdminGuard } from "../_guard";
import { getAdminConfigSR, updateAdminConfigSR } from "@/lib/adminConfig";

async function handleGetToggles(req: NextRequest, context: unknown, user: { id: string; email?: string }) {
  try {
    const config = await getAdminConfigSR();
    
    return NextResponse.json({
      daily_user_budget_usd: config.daily_user_budget_usd,
      daily_global_budget_usd: config.daily_global_budget_usd,
      disable_endpoints: config.disable_endpoints,
      alert_slack_webhook: config.alert_slack_webhook || null,
      updated_at: config.updated_at,
    });
  } catch (error) {
    console.error("Error fetching admin config:", error);
    return NextResponse.json(
      { error: "Failed to fetch configuration" },
      { status: 500 }
    );
  }
}

async function handleUpdateToggles(req: NextRequest, context: unknown, user: { id: string; email?: string }) {
  try {
    const body = await req.json();
    
    // Validate input
    const updates: Record<string, unknown> = {};
    
    if (typeof body.daily_user_budget_usd === "number" && body.daily_user_budget_usd >= 0) {
      updates.daily_user_budget_usd = body.daily_user_budget_usd;
    }
    
    if (typeof body.daily_global_budget_usd === "number" && body.daily_global_budget_usd >= 0) {
      updates.daily_global_budget_usd = body.daily_global_budget_usd;
    }
    
    if (Array.isArray(body.disable_endpoints)) {
      // Validate endpoint names
      const validEndpoints = ["planner", "lesson", "validator"];
      const filteredEndpoints = body.disable_endpoints.filter((ep: string) => 
        typeof ep === "string" && validEndpoints.includes(ep)
      );
      updates.disable_endpoints = filteredEndpoints;
    }
    
    if (typeof body.alert_slack_webhook === "string" || body.alert_slack_webhook === null) {
      updates.alert_slack_webhook = body.alert_slack_webhook;
    }
    
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid updates provided" },
        { status: 400 }
      );
    }
    
    const updatedConfig = await updateAdminConfigSR(updates);
    
    return NextResponse.json({
      message: "Configuration updated successfully",
      config: {
        daily_user_budget_usd: updatedConfig.daily_user_budget_usd,
        daily_global_budget_usd: updatedConfig.daily_global_budget_usd,
        disable_endpoints: updatedConfig.disable_endpoints,
        alert_slack_webhook: updatedConfig.alert_slack_webhook || null,
        updated_at: updatedConfig.updated_at,
      },
    });
  } catch (error) {
    console.error("Error updating admin config:", error);
    return NextResponse.json(
      { error: "Failed to update configuration" },
      { status: 500 }
    );
  }
}

export const GET = withAdminGuard(handleGetToggles);
export const POST = withAdminGuard(handleUpdateToggles);
