/**
 * AI Guard: Rate limiting, logging, and retry logic for AI calls
 */

import { DateTime } from "luxon";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

type Cfg = { userCap:number; globalCap:number; disabled:string[] };
let _cache: { cfg: Cfg; at: number } | null = null;

export async function loadConfig(ttlMs = 5000): Promise<Cfg> {
  const now = Date.now();
  if (_cache && now - _cache.at < ttlMs) return _cache.cfg;

  const { data } = await sb
    .from("admin_config")
    .select("daily_user_budget_usd,daily_global_budget_usd,disable_endpoints")
    .eq("id", 1)
    .single();

  const cfg: Cfg = {
    userCap: Number(data?.daily_user_budget_usd ?? process.env.DAILY_USER_BUDGET_USD ?? 0.25),
    globalCap: Number(data?.daily_global_budget_usd ?? process.env.DAILY_GLOBAL_BUDGET_USD ?? 10),
    disabled: Array.isArray(data?.disable_endpoints)
      ? (data!.disable_endpoints as string[])
      : (process.env.DISABLE_ENDPOINTS ?? "")
          .split(",")
          .map(s => s.trim())
          .filter(Boolean),
  };

  _cache = { cfg, at: now };
  return cfg;
}

export function invalidateConfigCache() { _cache = null; }

export async function checkCapsOrThrow(
  user_id: string,
  endpoint: "planner" | "lesson" | "validator"
) {
  const cfg = await loadConfig(); // ~5s TTL

  if (cfg.disabled.includes(endpoint)) {
    const e = new Error(`Endpoint ${endpoint} disabled`);
    // @ts-expect-error - Adding status property to Error
    e.status = 503; throw e;
  }

  const day = DateTime.now().toISODate();

  const [{ data: u }, { data: g }] = await Promise.all([
    sb.from("ai_daily_user_spend")
      .select("cost_usd,total_cost_usd")
      .eq("user_id", user_id)
      .eq("day", day)
      .maybeSingle(),
    sb.from("ai_daily_global_spend")
      .select("cost_usd,total_cost_usd")
      .eq("day", day)
      .maybeSingle(),
  ]);

  const userSpend = Number(u?.cost_usd ?? u?.total_cost_usd ?? 0);
  const globalSpend = Number(g?.cost_usd ?? g?.total_cost_usd ?? 0);

  if (userSpend >= cfg.userCap) {
    const e = new Error("Daily user budget reached");
    // @ts-expect-error - Adding status property to Error
    e.status = 429; throw e;
  }
  if (globalSpend >= cfg.globalCap) {
    const e = new Error("Global daily budget reached");
    // @ts-expect-error - Adding status property to Error
    e.status = 503; throw e;
  }
}

export async function logCall(entry: {
  user_id?: string;
  goal_id?: string;
  endpoint: "planner" | "lesson" | "validator";
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  success: boolean;
  latency_ms: number;
  error_text?: string;
  cost_usd: number;
}) {
  await sb.from("ai_call_log").insert({
    user_id: entry.user_id || null,
    goal_id: entry.goal_id || null,
    endpoint: entry.endpoint,
    model: entry.model,
    prompt_tokens: entry.prompt_tokens,
    completion_tokens: entry.completion_tokens,
    total_tokens: entry.prompt_tokens + entry.completion_tokens,
    cost_usd: entry.cost_usd,
    success: entry.success,
    latency_ms: entry.latency_ms,
    error_text: entry.error_text || null,
  });

  const day = DateTime.now().toISODate();
  if (entry.success) {
    await Promise.all([
      sb.rpc("inc_user_spend", { p_user_id: entry.user_id, p_day: day, p_cost_usd: entry.cost_usd }),
      sb.rpc("inc_global_spend", { p_day: day, p_cost_usd: entry.cost_usd }),
    ]);
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
