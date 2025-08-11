import { openai, modelFor } from "@/lib/openai";
import { z } from "zod";

type Msg = { role: "system"|"user"|"assistant"; content: string };
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function coerceJSON(text: string) {
  // strip fences if the model returns ```json ... ```
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  return JSON.parse(raw);
}

async function chatCore(model: string, messages: Msg[]) {
  // Try with json_object; if the model rejects it, fall back to normal.
  try {
    return await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      response_format: { type: "json_object" },
    });
  } catch {
    return await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
    });
  }
}

async function chatJSON<T>(opts: {
  task: "planner"|"lesson"|"validator",
  messages: Msg[],
  schema: z.ZodType<T>,
  temperature?: number
}): Promise<{ data: T; usage?: {prompt_tokens:number; completion_tokens:number; total_tokens:number} }> {
  const model = modelFor(opts.task);
  let delay = 400, lastErr: unknown;

  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await chatCore(model, opts.messages);
      const text = res.choices[0]?.message?.content ?? "";
      const parsed = coerceJSON(text);
      const data = opts.schema.parse(parsed);
      const usage = res.usage ? {
        prompt_tokens: res.usage.prompt_tokens ?? 0,
        completion_tokens: res.usage.completion_tokens ?? 0,
        total_tokens: res.usage.total_tokens ?? 0
      } : undefined;
      console.log(`[AI:${opts.task}] model=${model} tokens=${usage?.total_tokens ?? "?"}`);
      return { data, usage };
    } catch (err) {
      lastErr = err;
      if (attempt === 4) break;
      await sleep(delay + Math.floor(Math.random() * 150));
      delay *= 2;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("AI call failed");
}

export async function generatePlan(messages: Msg[]) {
  const { PlanJSON } = await import("@/types/ai");
  return chatJSON({ task: "planner", messages, schema: PlanJSON });
}

export async function generateLesson(messages: Msg[]) {
  const { LessonJSON } = await import("@/types/ai");
  return chatJSON({ task: "lesson", messages, schema: LessonJSON, temperature: 0.6 });
}

export async function validateLesson(messages: Msg[]) {
  const { ValidationJSON } = await import("@/types/ai");
  return chatJSON({ task: "validator", messages, schema: ValidationJSON, temperature: 0 });
} 