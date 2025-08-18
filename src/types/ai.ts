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
  version: z.literal("1"),
  topic: z.string(),
  total_days: z.number().int().min(1),
  modules: z.array(PlanModule).min(1),
  citations: z.array(z.string()).min(1),
});

export type TPlanJSON = z.infer<typeof PlanJSON>;

export const LessonJSON = z.object({
  topic: z.string().min(10).max(100), // More specific topic requirements
  reading: z.string().min(150).max(300), // Clear word count requirements
  walkthrough: z.string().min(200).max(400), // Clear word count requirements
  quiz: z.array(z.object({ 
    q: z.string().min(20).max(200), 
    a: z.array(z.string().min(10).max(100)).length(4), // Always 4 options
    correct_index: z.number().int().min(0).max(3) 
  })).length(2), // Exactly 2 questions
  exercise: z.string().min(50).max(200), // More specific exercise requirements
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