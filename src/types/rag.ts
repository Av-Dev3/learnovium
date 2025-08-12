import { z } from "zod";

export const Source = z.object({
  url: z.string(),
  title: z.string(),
  author: z.string().optional(),
  published_at: z.string().optional(),
  license: z.string().optional(),
});

export const Chunk = z.object({
  id: z.string(),
  topic: z.string(),
  subtopic: z.string().optional(),
  text_summary: z.string(),
  tags: z.array(z.string()).default([]),
  source: Source,
});

export const TopicPack = z.object({
  id: z.string(),
  topic: z.string(),
  subtopic: z.string().optional(),
  version: z.string().default("1"),
  locale: z.string().default("en"),
  chunks: z.array(Chunk).min(4),
  created_at: z.string().optional(),
});

export type TSource = z.infer<typeof Source>;
export type TChunk = z.infer<typeof Chunk>;
export type TTopicPack = z.infer<typeof TopicPack>; 