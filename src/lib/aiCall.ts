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
  console.log("AI: chatCore called with model:", model, "temperature:", desiredTemp);
  const baseParams = { model, messages };
  if (supportsCustomTemp(model) && typeof desiredTemp === "number") {
    console.log("AI: Using custom temperature:", desiredTemp);
    const result = await openai.chat.completions.create({
      ...baseParams,
      temperature: desiredTemp,
    });
    console.log("AI: chatCore with custom temp completed");
    return result;
  }
  // Keep it simple: no response_format. We'll parse ourselves.
  console.log("AI: Using default temperature");
  const result = await openai.chat.completions.create(baseParams);
  console.log("AI: chatCore with default temp completed");
  return result;
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
  console.log("AI: chatJSON called for task:", opts.task);
  const model = modelFor(opts.task);
  console.log("AI: Using model:", model);
  
  // Budget enforcement is now handled in the API routes
  // No need to check caps here

  // Use withRetries for better error handling
  return withRetries(async () => {
    console.log("AI: Starting OpenAI API call...");
    const t0 = Date.now();
    let usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } | undefined;

    try {
      const res = await chatCore(model, opts.messages, opts.temperature ?? 0.7);
      const dt = Date.now() - t0;
      console.log("AI: OpenAI API call successful, response received");

      const text = res.choices[0]?.message?.content ?? "";
      console.log("AI: Raw response text length:", text.length);
      const parsed = coerceJSON(text);
      console.log("AI: JSON parsed successfully");
      const data = opts.schema.parse(parsed);
      console.log("AI: Schema validation successful");
      
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
      console.error("AI: Error in chatJSON:", err);
      throw err;
    }
  }, { retries: 3, baseMs: 400 });
}

export async function generatePlan(messages: Msg[], userId?: string, goalId?: string) {
  console.log("AI: generatePlan called with", messages.length, "messages");
  try {
    const { PlanJSON } = await import("@/types/ai");
    console.log("AI: PlanJSON schema imported successfully");
    const result = await chatJSON({ task: "planner", messages, schema: PlanJSON, temperature: 0.6, userId, goalId });
    console.log("AI: generatePlan completed successfully");
    return result;
  } catch (error) {
    console.error("AI: generatePlan failed:", error);
    throw error;
  }
}

export async function generateLesson(messages: Msg[], userId?: string, goalId?: string) {
  const { LessonJSON } = await import("@/types/ai");
  return chatJSON({ task: "lesson", messages, schema: LessonJSON, temperature: 0.3, userId, goalId });
}

export async function validateLesson(messages: Msg[], userId?: string, goalId?: string) {
  const { ValidationJSON } = await import("@/types/ai");
  return chatJSON({ task: "validator", messages, schema: ValidationJSON, temperature: 0, userId, goalId });
}
