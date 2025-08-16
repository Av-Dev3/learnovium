/**
 * AI Guard: Rate limiting, logging, and retry logic for AI calls
 */

import { createClient } from "@supabase/supabase-js";
import { estimateCostUSD } from "./costs";
import { getBudgetLimits, isEndpointDisabled } from "./adminConfig";

export interface AICallLog {
  user_id: string;
  goal_id?: string;
  endpoint: "planner" | "lesson" | "validator";
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost_usd: number;
  latency_ms: number;
  success: boolean;
  error_text?: string;
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
 * Check budget caps and endpoint status before allowing AI call
 */
export async function checkCapsOrThrow(
  userId: string,
  endpoint: "planner" | "lesson" | "validator"
): Promise<void> {
  // Check if endpoint is disabled
  if (await isEndpointDisabled(endpoint)) {
    throw new Error(`Service temporarily unavailable: ${endpoint} endpoint is disabled`);
  }

  const supabase = getServiceRoleClient();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const { userBudget, globalBudget } = await getBudgetLimits();

  // Check user daily spend
  const { data: userSpend } = await supabase
    .from("ai_daily_user_spend")
    .select("total_cost_usd")
    .eq("user_id", userId)
    .eq("day", today)
    .single();

  if (userSpend && userSpend.total_cost_usd >= userBudget) {
    throw new Error(`Daily budget exceeded. Limit: $${userBudget.toFixed(4)}, spent: $${userSpend.total_cost_usd.toFixed(4)}`);
  }

  // Check global daily spend
  const { data: globalSpend } = await supabase
    .from("ai_daily_global_spend")
    .select("total_cost_usd")
    .eq("day", today)
    .single();

  if (globalSpend && globalSpend.total_cost_usd >= globalBudget) {
    throw new Error(`Global daily budget exceeded. Service temporarily unavailable.`);
  }
}

/**
 * Log an AI call and update spend rollups
 */
export async function logCall(callData: AICallLog): Promise<void> {
  const supabase = getServiceRoleClient();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    // Insert the call log
    const { error: logError } = await supabase
      .from("ai_call_log")
      .insert({
        user_id: callData.user_id,
        goal_id: callData.goal_id,
        endpoint: callData.endpoint,
        model: callData.model,
        prompt_tokens: callData.prompt_tokens,
        completion_tokens: callData.completion_tokens,
        total_tokens: callData.total_tokens,
        cost_usd: callData.cost_usd,
        latency_ms: callData.latency_ms,
        success: callData.success,
        error_text: callData.error_text,
      });

    if (logError) {
      console.error("Failed to log AI call:", logError);
    }

    // Update rollups only for successful calls
    if (callData.success) {
      // Update user spend rollup
      const { error: userRollupError } = await supabase
        .rpc("inc_user_spend", {
          p_user_id: callData.user_id,
          p_day: today,
          p_cost_usd: callData.cost_usd,
        });

      if (userRollupError) {
        console.error("Failed to update user spend rollup:", userRollupError);
      }

      // Update global spend rollup
      const { error: globalRollupError } = await supabase
        .rpc("inc_global_spend", {
          p_day: today,
          p_cost_usd: callData.cost_usd,
        });

      if (globalRollupError) {
        console.error("Failed to update global spend rollup:", globalRollupError);
      }
    }
  } catch (error) {
    console.error("Error in logCall:", error);
  }
}

/**
 * Retry wrapper with exponential backoff
 */
export async function withRetries<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    baseMs?: number;
    maxMs?: number;
  } = {}
): Promise<T> {
  const { retries = 3, baseMs = 1000, maxMs = 30000 } = options;
  let lastError: Error | unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on the last attempt
      if (attempt === retries) {
        break;
      }

      // Don't retry client errors (4xx) except 429
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes("400") || message.includes("401") || message.includes("403")) {
          throw error;
        }
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(baseMs * Math.pow(2, attempt), maxMs);
      const jitter = Math.random() * 0.1 * delay; // Add 10% jitter
      
      console.log(`Retry attempt ${attempt + 1}/${retries} after ${delay + jitter}ms`);
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }

  throw lastError;
}

/**
 * Helper to create AI call log entry from OpenAI response
 */
export function createCallLog(
  userId: string,
  endpoint: "planner" | "lesson" | "validator",
  model: string,
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } | undefined,
  latencyMs: number,
  success: boolean,
  errorText?: string,
  goalId?: string
): AICallLog {
  const promptTokens = usage?.prompt_tokens || 0;
  const completionTokens = usage?.completion_tokens || 0;
  const totalTokens = usage?.total_tokens || 0;
  const costUsd = estimateCostUSD(model, promptTokens, completionTokens);

  return {
    user_id: userId,
    goal_id: goalId,
    endpoint,
    model,
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
    total_tokens: totalTokens,
    cost_usd: costUsd,
    latency_ms: latencyMs,
    success,
    error_text: errorText,
  };
}
