import { openai, modelFor } from "@/lib/openai";
import { z } from "zod";
import { track } from "@/lib/obs";
import { withRetries } from "@/lib/aiGuard";

type Msg = { role: "system" | "user" | "assistant"; content: string };
// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function coerceJSON(text: string) {
  try {
    // First, try to find JSON in code blocks
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      const raw = fenced[1].trim();
      return JSON.parse(raw);
    }
    
    // If no code blocks, try to find JSON in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If still no JSON found, try to parse the entire text
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("JSON parsing failed. Raw text:", text.substring(0, 200) + "...");
    console.error("JSON parsing error:", error);
    throw new Error(`Failed to parse AI response as JSON. The AI should return valid JSON but returned: "${text.substring(0, 100)}..."`);
  }
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
  }, { retries: 1, baseMs: 1000 }); // Reduced retries for faster timeout detection
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
  return chatJSON({ task: "lesson", messages, schema: LessonJSON, temperature: 0.4, userId, goalId });
}

export async function validateLesson(messages: Msg[], userId?: string, goalId?: string) {
  const { ValidationJSON } = await import("@/types/ai");
  return chatJSON({ task: "validator", messages, schema: ValidationJSON, temperature: 0, userId, goalId });
}

export async function generateFlashcards(
  lessonContent: Array<{
    day: number;
    topic: string;
    reading: string;
    walkthrough: string;
    quiz?: Array<{ question: string; options: string[]; correctAnswer: number }>;
  }>,
  goalTopic: string,
  goalFocus?: string
) {
  const { FlashcardJSON } = await import("@/types/ai");
  
  const systemPrompt = `You are an expert at creating educational flashcards for spaced repetition learning. 

Create high-quality flashcards from the provided lesson content that:
1. Test key concepts and practical knowledge
2. Use clear, concise questions and answers
3. Vary in difficulty (easy, medium, hard)
4. Focus on understanding, not just memorization
5. Include practical applications when possible

Generate 3-5 flashcards per lesson, focusing on the most important concepts.`;

  const userPrompt = `Topic: ${goalTopic}
${goalFocus ? `Focus: ${goalFocus}` : ''}

Lesson Content:
${lessonContent.map(lesson => `
Day ${lesson.day}: ${lesson.topic}

Reading:
${lesson.reading}

Walkthrough:
${lesson.walkthrough}

${lesson.quiz ? `Quiz Questions:
${lesson.quiz.map(q => `- ${q.question}`).join('\n')}` : ''}
`).join('\n---\n')}

Create flashcards that help students master these concepts through spaced repetition. Mix question types and difficulty levels.`;

  const messages: Msg[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];

  try {
    const result = await chatJSON({ 
      task: "lesson", // Reuse lesson model for flashcard generation
      messages, 
      schema: FlashcardJSON, 
      temperature: 0.7 
    });
    return { data: result.data.flashcards, usage: result.usage };
  } catch (error) {
    console.error("Flashcard generation error:", error);
    return { error: "Failed to generate flashcards", data: null };
  }
}
