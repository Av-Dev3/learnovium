import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY");
}

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Helper to resolve model names with sane defaults per task.
export function modelFor(task: "planner"|"lesson"|"validator") {
  switch (task) {
    case "planner": return process.env.OPENAI_MODEL_PLANNER ?? "gpt-5-mini";
    case "lesson": return process.env.OPENAI_MODEL_LESSON ?? "gpt-5-mini";
    case "validator": return process.env.OPENAI_MODEL_VALIDATOR ?? "gpt-5-mini";
  }
} 