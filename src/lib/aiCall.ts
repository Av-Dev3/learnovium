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
  
  try {
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
  } catch (error) {
    console.error("AI: chatCore failed with error:", error);
    console.error("AI: Model used:", model);
    console.error("AI: OpenAI API Key exists:", !!process.env.OPENAI_API_KEY);
    console.error("AI: OpenAI API Key length:", process.env.OPENAI_API_KEY?.length || 0);
    throw error;
  }
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
      console.log("AI: About to call chatCore with model:", model);
      console.log("AI: Message count:", opts.messages.length);
      console.log("AI: Temperature:", opts.temperature ?? 0.7);
      
      const res = await chatCore(model, opts.messages, opts.temperature ?? 0.7);
      const dt = Date.now() - t0;
      console.log("AI: OpenAI API call successful, response received in", dt, "ms");

      const text = res.choices[0]?.message?.content ?? "";
      console.log("AI: Raw response text length:", text.length);
      console.log("AI: Raw response preview:", text.substring(0, 500) + "...");
      
      const parsed = coerceJSON(text);
      console.log("AI: JSON parsed successfully");
      console.log("AI: Parsed JSON keys:", Object.keys(parsed));
      console.log("AI: Parsed JSON sample:", JSON.stringify(parsed, null, 2).substring(0, 1000) + "...");
      
      usage = res.usage ? {
        prompt_tokens: res.usage.prompt_tokens ?? 0,
        completion_tokens: res.usage.completion_tokens ?? 0,
        total_tokens: res.usage.total_tokens ?? 0
      } : undefined;

      try {
        const data = opts.schema.parse(parsed);
        console.log("AI: Schema validation successful");
        
        // Keep existing tracking
        track({ task: opts.task, model, ms: dt, usage });

        const costStr = usage ? `$${(usage.prompt_tokens * 0.00015/1000 + usage.completion_tokens * 0.0006/1000).toFixed(6)}` : "?";
        console.log(`[AI:${opts.task}] model=${model} tokens=${usage?.total_tokens ?? "?"} cost=${costStr}`);
        return { data, usage };
      } catch (schemaError) {
        console.error("AI: Schema validation failed:", schemaError);
        console.error("AI: Parsed JSON that failed validation:", JSON.stringify(parsed, null, 2));
        throw schemaError;
      }
    } catch (err) {
      console.error("AI: Error in chatJSON:", err);
      if (err instanceof Error && err.message.includes("parse")) {
        console.error("AI: This was a schema validation error");
        console.error("AI: Full error details:", JSON.stringify(err, null, 2));
      }
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

Your task is to create flashcards DIRECTLY from the provided lesson content. You must:

1. READ the lesson content carefully and identify the key concepts, definitions, and important details
2. Create flashcards that test understanding of specific information from the reading material
3. Use clear, concise questions and answers
4. Vary in difficulty (easy, medium, hard)
5. Focus on understanding, not just memorization
6. Base questions on specific details and concepts explained in the lesson content
7. Make sure each flashcard tests knowledge that can be found in the provided reading material

CRITICAL: Every flashcard must be based on information that is explicitly stated or explained in the lesson content. Do not create flashcards about general knowledge that isn't covered in the lesson.

CRITICAL: You MUST return ONLY valid JSON in the exact format specified. No markdown, no backticks, no commentary, no human-readable format. Only pure JSON.

Generate 4-6 flashcards per lesson, focusing on the most important concepts from the comprehensive reading material.`;

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

INSTRUCTIONS:
1. Read the lesson content above carefully
2. Identify the key concepts, definitions, and important details from the reading material
3. Create flashcards that test understanding of these specific concepts
4. Each flashcard should have a clear question and a detailed answer
5. Base your questions on information that is explicitly stated in the reading material
6. Vary the difficulty levels (easy, medium, hard)
7. Focus on concepts that are important for understanding the topic

CRITICAL: You MUST return ONLY valid JSON in this EXACT format:
{
  "flashcards": [
    {
      "front": "Question text here",
      "back": "Answer text here", 
      "difficulty": "easy"
    },
    {
      "front": "Another question",
      "back": "Another answer",
      "difficulty": "medium"
    }
  ]
}

IMPORTANT: Keep answers concise but informative. Front text should be 10-200 characters, back text should be 5-500 characters.

Do NOT include any other text, explanations, or formatting. Only return the JSON object.`;

  const messages: Msg[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];

  try {
    console.log("Starting AI flashcard generation...");
    const result = await chatJSON({ 
      task: "lesson", // Reuse lesson model for flashcard generation
      messages, 
      schema: FlashcardJSON, 
      temperature: 0.7 
    });
    console.log("AI flashcard generation successful:", result.data);
    return { data: result.data.flashcards, usage: result.usage };
  } catch (error) {
    console.error("Flashcard generation error:", error);
    return { error: "Failed to generate flashcards", data: null };
  }
}
