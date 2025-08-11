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
  topic: z.string(),
  reading: z.string(),
  walkthrough: z.string(),
  quiz: z.array(z.object({ q: z.string(), a: z.array(z.string()).min(2), correct_index: z.number().int() })).length(2),
  exercise: z.string(),
  citations: z.array(z.string()).min(1),
  est_minutes: z.number().int().min(5).max(10),
});

export type TLessonJSON = z.infer<typeof LessonJSON>;

export const ValidationJSON = z.object({
  citations: z.boolean(),
  out_of_context: z.boolean(),
  notes: z.string().optional(),
});

export type TValidationJSON = z.infer<typeof ValidationJSON>; 