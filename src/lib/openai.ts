import OpenAI from "openai";

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    console.log("AI: Initializing OpenAI client...");
    console.log("AI: OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
    console.log("AI: OPENAI_API_KEY length:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);

    if (!process.env.OPENAI_API_KEY) {
      console.error("AI: Missing OPENAI_API_KEY environment variable");
      throw new Error("Missing OPENAI_API_KEY");
    }

    _openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY!,
      timeout: 150000, // 150 seconds timeout for OpenAI calls - longer than task timeouts
      maxRetries: 0, // Disable automatic retries to respect our timeout
    });
    console.log("AI: OpenAI client initialized successfully");
  }
  return _openai;
}

export const openai = new Proxy({} as OpenAI, {
  get(target, prop) {
    return getOpenAI()[prop as keyof OpenAI];
  }
});

// Helper to resolve model names with sane defaults per task.
export function modelFor(task: "planner"|"lesson"|"validator") {
  let model: string;
  switch (task) {
    case "planner": 
      model = process.env.OPENAI_MODEL_PLANNER ?? "gpt-5-mini";
      break;
    case "lesson": 
      model = process.env.OPENAI_MODEL_LESSON ?? "gpt-5-mini";
      break;
    case "validator": 
      model = process.env.OPENAI_MODEL_VALIDATOR ?? "gpt-5-mini";
      break;
  }
  console.log("AI: modelFor selected model:", model, "for task:", task);
  return model;
} 