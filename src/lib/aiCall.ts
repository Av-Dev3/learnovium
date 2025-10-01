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

async function chatCore(model: string, messages: Msg[], desiredTemp?: number, taskType?: string) {
  console.log("AI: chatCore called with model:", model, "temperature:", desiredTemp, "task:", taskType);
  const baseParams = { model, messages };
  
  // Add timeout wrapper - longer for plan generation, shorter for other tasks
  const timeoutMs = taskType === 'planner' ? 120000 : 60000; // 2 minutes for plans, 1 minute for others
  console.log(`AI: Setting timeout for ${timeoutMs}ms (task: ${taskType})`);
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      console.error(`AI: TIMEOUT TRIGGERED after ${timeoutMs}ms`);
      reject(new Error(`OpenAI API call timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  
  try {
    console.log("AI: Model being used:", model);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let apiCall: Promise<any>;
    
    if (supportsCustomTemp(model) && typeof desiredTemp === "number") {
      console.log("AI: Using custom temperature:", desiredTemp);
      console.log("AI: About to call OpenAI API with custom temp...");
      apiCall = openai.chat.completions.create({
        ...baseParams,
        temperature: desiredTemp,
      });
    } else {
      // Keep it simple: no response_format. We'll parse ourselves.
      console.log("AI: Using default temperature");
      console.log("AI: About to call OpenAI API with default temp...");
      apiCall = openai.chat.completions.create(baseParams);
    }
    
    console.log("AI: Waiting for API response or timeout...");
    const result = await Promise.race([apiCall, timeoutPromise]);
    console.log("AI: chatCore completed successfully");
    console.log("AI: Response received, choices count:", result.choices?.length || 0);
    return result;
  } catch (error) {
    console.error("AI: chatCore failed with error:", error);
    console.error("AI: Model used:", model);
    console.error("AI: OpenAI API Key exists:", !!process.env.OPENAI_API_KEY);
    console.error("AI: OpenAI API Key length:", process.env.OPENAI_API_KEY?.length || 0);
    console.error("AI: Error details:", error instanceof Error ? error.message : String(error));
    
    // Check if it's a timeout error
    if (error instanceof Error && error.message.includes('timeout')) {
      console.error("AI: Request timed out");
    }
    
    // Check if it's an invalid model error
    if (error instanceof Error && error.message.includes('model')) {
      console.error("AI: This appears to be a model-related error. Verify the model name is valid.");
    }
    
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
      
      const res = await chatCore(model, opts.messages, opts.temperature ?? 0.7, opts.task);
      const dt = Date.now() - t0;
      console.log("AI: OpenAI API call successful, response received in", dt, "ms");

      const text = res.choices[0]?.message?.content ?? "";
      console.log("AI: Raw response text length:", text.length);
      console.log("AI: Raw response preview:", text.substring(0, 500) + "...");
      
      if (!text || text.trim().length === 0) {
        throw new Error("AI returned empty response");
      }
      
      console.log("AI: Attempting to parse JSON from response...");
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
  
  const systemPrompt = `You are an expert at creating educational flashcards. Create flashcards based on the provided lesson content.

TASK: Generate 4-6 flashcards that test understanding of the lesson content.

REQUIREMENTS:
- Base questions on specific information from the lesson reading
- Use clear, concise questions and answers
- Vary difficulty: easy, medium, hard
- Focus on key concepts and definitions from the lesson

CRITICAL: Return ONLY valid JSON in this exact format:
{
  "flashcards": [
    {
      "front": "Question text here",
      "back": "Answer text here", 
      "difficulty": "easy"
    }
  ]
}

Do NOT include markdown, backticks, or any other formatting. Only return the pure JSON object.`;

  const userPrompt = `Create flashcards for this lesson:

Topic: ${goalTopic}
${goalFocus ? `Focus: ${goalFocus}` : ''}

Lesson Content:
${lessonContent.map(lesson => `
Day ${lesson.day}: ${lesson.topic}
Reading: ${lesson.reading}
Walkthrough: ${lesson.walkthrough}
`).join('\n---\n')}

Create 4-6 flashcards based on the lesson content. Return ONLY valid JSON in this format:
{
  "flashcards": [
    {
      "front": "Question text here",
      "back": "Answer text here", 
      "difficulty": "easy"
    }
  ]
}`;

  const messages: Msg[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];

  try {
    console.log("Starting AI flashcard generation...");
    console.log("Flashcard generation prompt preview:", {
      systemPromptLength: systemPrompt.length,
      userPromptLength: userPrompt.length,
      lessonCount: lessonContent.length
    });
    
    console.log("AI: Starting flashcard generation...");
    const result = await chatJSON({ 
      task: "lesson", // Reuse lesson model for flashcard generation
      messages, 
      schema: FlashcardJSON, 
      temperature: 0.7 
    });
    
    console.log("AI flashcard generation successful:", {
      hasData: !!result.data,
      flashcardsCount: result.data?.flashcards?.length || 0,
      usage: result.usage
    });
    
    if (!result.data || !result.data.flashcards) {
      console.error("Invalid flashcard response structure:", result.data);
      return { error: "Invalid flashcard response structure", data: null };
    }
    
    return { data: result.data.flashcards, usage: result.usage };
  } catch (error) {
    console.error("Flashcard generation error:", error);
    return { error: `Failed to generate flashcards: ${error instanceof Error ? error.message : 'Unknown error'}`, data: null };
  }
}
