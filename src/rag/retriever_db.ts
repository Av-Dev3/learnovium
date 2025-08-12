import { supabaseServer } from "@/lib/supabaseServer";
import { embedTexts } from "@/rag/embeddings";

// Define types for the database results
type ChunkResult = {
  id: string;
  topic: string;
  subtopic: string | null;
  text_summary: string;
  tags: string[];
  similarity: number;
};

type EnrichedResult = {
  id: string;
  score: number;
  chunk: {
    id: string;
    topic: string;
    subtopic: string | null;
    text_summary: string;
    tags: string[];
    source: { url: string; title: string; author: string };
  };
};

export async function retrieveContextDB(query: string, k = 5, topicFilter?: string) {
  const [qvec] = await embedTexts([query]);
  // RPC expects a 1536-length vector. Supabase JS will serialize number[].
  const supa = await supabaseServer(); // server-side, no req needed for read
  const { data, error } = await supa.rpc("match_chunks", {
    query_embedding: qvec,
    match_count: k,
    topic_filter: topicFilter ?? null
  });

  if (error) throw new Error(`match_chunks error: ${error.message}`);

  // Build context bullets like our in-memory version
  const results: EnrichedResult[] = (data ?? []).map((r: ChunkResult) => ({
    id: r.id,
    score: r.similarity,
    chunk: {
      id: r.id,
      topic: r.topic,
      subtopic: r.subtopic,
      text_summary: r.text_summary,
      tags: r.tags,
      source: { url: "", title: "", author: "" } // will enrich in importer
    }
  }));

  const context = results
    .map((r: EnrichedResult) => `• ${r.chunk.text_summary}`)
    .join("\n");

  return { results, context };
} 