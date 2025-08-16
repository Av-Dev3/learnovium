/**
 * Admin Top Users API
 * GET /api/admin/metrics/top-users
 */

import { NextRequest, NextResponse } from "next/server";
import { withAdminGuard } from "../../_guard";
import { createClient } from "@supabase/supabase-js";

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

async function handleTopUsers(req: NextRequest, context: unknown, user: { id: string; email?: string }) {
  try {
    const supabase = getServiceRoleClient();
    
    // Get top users from the view
    const { data: topUsers, error } = await supabase
      .from("v_top_users_today")
      .select("*")
      .order("total_cost_usd", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching top users:", error);
      return NextResponse.json(
        { error: "Failed to fetch top users" },
        { status: 500 }
      );
    }

    // Format the response
    const formattedUsers = topUsers?.map(user => ({
      user_id: user.user_id,
      email: user.email || "Unknown",
      is_admin: user.is_admin || false,
      call_count: user.call_count || 0,
      total_cost_usd: parseFloat(user.total_cost_usd || "0"),
      success_calls: user.success_calls || 0,
      error_calls: user.error_calls || 0,
      success_rate: user.call_count > 0 ? ((user.success_calls || 0) / user.call_count * 100).toFixed(1) : "0.0",
    })) || [];

    return NextResponse.json({
      users: formattedUsers,
      total_users: formattedUsers.length,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in top users endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withAdminGuard(handleTopUsers);
