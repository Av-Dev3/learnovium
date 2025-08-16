import { supabaseServer } from "@/lib/supabaseServer";
import { embedTexts } from "@/rag/embeddings";
import type { NextRequest } from "next/server";

type ChunkResult = {
  id: string;
  similarity: number;
  topic: string;
  subtopic: string | null;
  text_summary: string;
  tags: string[];
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

export async function retrieveContextDB(query: string, k = 5, topicFilter?: string, req?: NextRequest) {
  const [qvec] = await embedTexts([query]);
  const supa = await supabaseServer(); // forwards Authorization if provided (arg currently unused)
  const { data, error } = await supa.rpc("match_chunks", {
    query_embedding: qvec,
    match_count: k,
    topic_filter: topicFilter ?? null
  });
  if (error) throw new Error(`match_chunks error: ${error.message}`);

  const results: EnrichedResult[] = (data ?? []).map((r: ChunkResult) => ({
    id: r.id,
    score: r.similarity as number,
    chunk: {
      id: r.id,
      topic: r.topic,
      subtopic: r.subtopic,
      text_summary: r.text_summary,
      tags: r.tags,
      source: { url: "", title: "", author: "" }
    }
  }));

  const context = results.map((r: EnrichedResult) => `• ${r.chunk.text_summary}`).join("\n");
  return { results, context };
} 