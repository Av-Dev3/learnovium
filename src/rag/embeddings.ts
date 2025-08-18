import { openai } from "@/lib/openai";

export async function embedTexts(texts: string[], model = process.env.OPENAI_EMBED_MODEL ?? "text-embedding-3-small") {
  if (!texts.length) return [];
  
  try {
    const res = await openai.embeddings.create({ model, input: texts });
    return res.data.map(d => d.embedding as number[]);
  } catch (error) {
    console.error("OpenAI embeddings failed:", error);
    // Return empty embeddings as fallback
    return texts.map(() => new Array(1536).fill(0));
  }
} 