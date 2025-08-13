import { buildIndexFromSeeds, RAGIndex } from "./indexer";
import { retrieveContextDB } from "@/rag/retriever_db";

let indexPromise: Promise<RAGIndex> | null = null;

// Lazy global index to avoid rebuilding on each request
export function getIndex() {
  if (!indexPromise) indexPromise = buildIndexFromSeeds();
  return indexPromise;
}

// rag/retriever.ts
export async function retrieveContext(query: string, k = 5, topicFilter?: string) {
  // Try DB-backed RAG first
  try {
    const db = await retrieveContextDB(query, k, topicFilter);
    if (db.results?.length) return db;
  } catch {
    // ignore and fall back to seed
  }
  // Fall back to local seed index
  const idx = await getIndex();
  const { embedTexts } = await import("./embeddings");
  const [qvec] = await embedTexts([query]);
  const results = idx.store.search(qvec, k, (c) => topicFilter ? c.topic.toLowerCase() === topicFilter.toLowerCase() : true);
  const context = results.map(r => `• ${r.chunk.text_summary}`).join("\n");
  return { results, context };
}
 