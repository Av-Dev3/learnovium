/**
 * Admin Configuration Management
 * Uses SERVICE_ROLE for database access
 */

import { createClient } from "@supabase/supabase-js";

export interface AdminConfig {
  id: number;
  daily_user_budget_usd: number;
  daily_global_budget_usd: number;
  disable_endpoints: string[]; // ['planner', 'lesson', 'validator']
  alert_slack_webhook?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get Supabase client with service role (bypasses RLS)
 */
function getServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Get admin configuration using service role
 */
export async function getAdminConfigSR(): Promise<AdminConfig> {
  const supabase = getServiceRoleClient();
  
  const { data, error } = await supabase
    .from("admin_config")
    .select("*")
    .eq("id", 1)
    .single();
    
  if (error) {
    console.error("Failed to fetch admin config:", error);
    // Return default config if fetch fails
    return {
      id: 1,
      daily_user_budget_usd: parseFloat(process.env.DAILY_USER_BUDGET_USD || "0.25"),
      daily_global_budget_usd: parseFloat(process.env.DAILY_GLOBAL_BUDGET_USD || "10"),
      disable_endpoints: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  
  return data;
}

/**
 * Update admin configuration using service role
 */
export async function updateAdminConfigSR(updates: Partial<AdminConfig>): Promise<AdminConfig> {
  const supabase = getServiceRoleClient();
  
  const { data, error } = await supabase
    .from("admin_config")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1)
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to update admin config: ${error.message}`);
  }
  
  return data;
}

/**
 * Check if an endpoint is disabled
 */
export async function isEndpointDisabled(endpoint: string): Promise<boolean> {
  try {
    const config = await getAdminConfigSR();
    return config.disable_endpoints.includes(endpoint);
  } catch (error) {
    console.error("Error checking endpoint status:", error);
    return false; // Default to enabled if we can't check
  }
}

/**
 * Get current budget limits
 */
export async function getBudgetLimits(): Promise<{
  userBudget: number;
  globalBudget: number;
}> {
  try {
    const config = await getAdminConfigSR();
    return {
      userBudget: config.daily_user_budget_usd,
      globalBudget: config.daily_global_budget_usd,
    };
  } catch (error) {
    console.error("Error fetching budget limits:", error);
    return {
      userBudget: parseFloat(process.env.DAILY_USER_BUDGET_USD || "0.25"),
      globalBudget: parseFloat(process.env.DAILY_GLOBAL_BUDGET_USD || "10"),
    };
  }
}
