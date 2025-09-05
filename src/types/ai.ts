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
  topic: z.string().min(10).max(100), // More specific topic requirements
  reading: z.string().min(800).max(1500), // Substantial reading content
  walkthrough: z.string().min(400).max(800), // Detailed walkthrough content
  quiz: z.array(z.object({ 
    q: z.string().min(20).max(200), 
    a: z.array(z.string().min(10).max(100)).length(4), // Always 4 options
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
    back: z.string().min(5).max(300), // Answer/explanation
    difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  })).min(3).max(20), // 3-20 flashcards per generation
});

export type TFlashcardJSON = z.infer<typeof FlashcardJSON>; 