import { openai } from "@/lib/openai";

export async function embedTexts(texts: string[], model = process.env.OPENAI_EMBED_MODEL ?? "text-embedding-3-small") {
  if (!texts.length) return [];
  const res = await openai.embeddings.create({ model, input: texts });
  return res.data.map(d => d.embedding as number[]);
} 