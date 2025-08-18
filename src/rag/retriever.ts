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
  console.log("RAG: Starting context retrieval for query:", query);
  
  // Try DB-backed RAG first
  try {
    console.log("RAG: Attempting DB-backed retrieval...");
    const db = await retrieveContextDB(query, k, topicFilter);
    if (db.results?.length) {
      console.log("RAG: DB retrieval successful, found", db.results.length, "results");
      return db;
    }
    console.log("RAG: DB retrieval returned no results, falling back to seed");
  } catch (error) {
    console.warn("RAG: DB RAG failed, falling back to seed:", error);
    // ignore and fall back to seed
  }
  
  try {
    console.log("RAG: Attempting seed-based retrieval...");
    // Fall back to local seed index
    const idx = await getIndex();
    const { embedTexts } = await import("./embeddings");
    const [qvec] = await embedTexts([query]);
    const results = idx.store.search(qvec, k, (c) => topicFilter ? c.topic.toLowerCase() === topicFilter.toLowerCase() : true);
    const context = results.map(r => `• ${r.chunk.text_summary}`).join("\n");
    console.log("RAG: Seed retrieval successful, found", results.length, "results");
    return { results, context };
  } catch (error) {
    console.error("RAG: Seed RAG also failed:", error);
    // Return empty context as last resort
    console.log("RAG: Returning empty context as last resort");
    return { results: [], context: "No context available. Please try again later." };
  }
}
 