import { z } from "zod";

export const PlanDay = z.object({
  day_index: z.number().int().min(1),
  topic: z.string(),
  objective: z.string(),
  practice: z.string(),
  assessment: z.string(),
  est_minutes: z.number().int().min(5).max(120),
});

export const PlanModule = z.object({
  title: z.string(),
  days: z.array(PlanDay).min(1),
});

export const PlanJSON = z.object({
  version: z.union([z.literal("1"), z.literal("1.0")]).transform(() => "1"), // Accept both "1" and "1.0" 
  topic: z.string(),
  total_days: z.number().int().min(1),
  modules: z.array(PlanModule).min(1),
  citations: z.array(z.string()).min(1),
});

export type TPlanJSON = z.infer<typeof PlanJSON>;

export const LessonJSON = z.object({
  topic: z.string().min(10).max(200), // Increased limit for longer topic titles
  reading: z.string().min(800).max(4000), // Increased reading content limit
  walkthrough: z.string().min(400).max(800), // Detailed walkthrough content
  quiz: z.array(z.object({ 
    q: z.string().min(20).max(200), 
    a: z.array(z.string().min(5).max(150)).length(4), // Always 4 options - more flexible length
    correct_index: z.number().int().min(0).max(3) 
  })).length(2), // Exactly 2 questions
  exercise: z.string().min(100).max(300), // More substantial exercise requirements
  citations: z.array(z.string().min(10)).min(1).max(3), // Better citation requirements
  est_minutes: z.number().int().min(5).max(20), // More realistic time range
});

export type TLessonJSON = z.infer<typeof LessonJSON>;

export const ValidationJSON = z.object({
  citations: z.boolean(),
  out_of_context: z.boolean(),
  notes: z.string().optional(),
});

export type TValidationJSON = z.infer<typeof ValidationJSON>;

export const FlashcardJSON = z.object({
  flashcards: z.array(z.object({
    front: z.string().min(10).max(200), // Question/prompt
    back: z.string().min(5).max(500), // Answer/explanation - increased limit for detailed answers
    difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  })).min(4).max(20), // 4-20 flashcards per generation
});

export type TFlashcardJSON = z.infer<typeof FlashcardJSON>;

export const QuizJSON = z.object({
  title: z.string().min(10).max(200),
  description: z.string().min(20).max(500),
  time_limit_minutes: z.number().int().min(5).max(120),
  questions: z.array(z.object({
    question: z.string().min(20).max(300),
    type: z.enum(["multiple_choice", "true_false", "fill_blank"]),
    options: z.array(z.string().min(5).max(150)).optional(),
    correct_answer_index: z.number().int().min(0).max(3).optional(),
    correct_answer_text: z.string().min(1).max(100).optional(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    points: z.number().int().min(1).max(5),
    explanation: z.string().min(10).max(300)
  })).min(1).max(20)
});

export type TQuizJSON = z.infer<typeof QuizJSON>; 