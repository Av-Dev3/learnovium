import { openai, modelFor } from "@/lib/openai";
import { z } from "zod";
import { track } from "@/lib/obs";
import { withRetries } from "@/lib/aiGuard";

type Msg = { role: "system" | "user" | "assistant"; content: string };
// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function coerceJSON(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  return JSON.parse(raw);
}

// Budget models (e.g., gpt-5-mini) reject custom temperature.
function supportsCustomTemp(model: string) {
  return !/mini/i.test(model);
}

async function chatCore(model: string, messages: Msg[], desiredTemp?: number) {
  const baseParams = { model, messages };
  if (supportsCustomTemp(model) && typeof desiredTemp === "number") {
    return await openai.chat.completions.create({
      ...baseParams,
      temperature: desiredTemp,
    });
  }
  // Keep it simple: no response_format. We'll parse ourselves.
  return await openai.chat.completions.create(baseParams);
}

async function chatJSON<T>(opts: {
  task: "planner" | "lesson" | "validator";
  messages: Msg[];
  schema: z.ZodType<T>;
  temperature?: number;
  userId?: string;
  goalId?: string;
}): Promise<{
  data: T;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}> {
  const model = modelFor(opts.task);
  
  // Budget enforcement is now handled in the API routes
  // No need to check caps here

  // Use withRetries for better error handling
  return withRetries(async () => {
    const t0 = Date.now();
    let usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } | undefined;

    try {
      const res = await chatCore(model, opts.messages, opts.temperature ?? 0.7);
      const dt = Date.now() - t0;

      const text = res.choices[0]?.message?.content ?? "";
      const parsed = coerceJSON(text);
      const data = opts.schema.parse(parsed);
      
      usage = res.usage ? {
        prompt_tokens: res.usage.prompt_tokens ?? 0,
        completion_tokens: res.usage.completion_tokens ?? 0,
        total_tokens: res.usage.total_tokens ?? 0
      } : undefined;

      // Keep existing tracking
      track({ task: opts.task, model, ms: dt, usage });

      const costStr = usage ? `$${(usage.prompt_tokens * 0.00015/1000 + usage.completion_tokens * 0.0006/1000).toFixed(6)}` : "?";
      console.log(`[AI:${opts.task}] model=${model} tokens=${usage?.total_tokens ?? "?"} cost=${costStr}`);
      return { data, usage };
    } catch (err) {
      throw err;
    }
  }, { retries: 3, baseMs: 400 });
}

export async function generatePlan(messages: Msg[], userId?: string, goalId?: string) {
  const { PlanJSON } = await import("@/types/ai");
  return chatJSON({ task: "planner", messages, schema: PlanJSON, temperature: 0.6, userId, goalId });
}

export async function generateLesson(messages: Msg[], userId?: string, goalId?: string) {
  const { LessonJSON } = await import("@/types/ai");
  return chatJSON({ task: "lesson", messages, schema: LessonJSON, temperature: 0.3, userId, goalId });
}

export async function validateLesson(messages: Msg[], userId?: string, goalId?: string) {
  const { ValidationJSON } = await import("@/types/ai");
  return chatJSON({ task: "validator", messages, schema: ValidationJSON, temperature: 0, userId, goalId });
}
