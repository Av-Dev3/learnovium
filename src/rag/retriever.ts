import { buildIndexFromSeeds, RAGIndex } from "./indexer";

let indexPromise: Promise<RAGIndex> | null = null;

// Lazy global index to avoid rebuilding on each request
export function getIndex() {
  if (!indexPromise) indexPromise = buildIndexFromSeeds();
  return indexPromise;
}

// rag/retriever.ts
export async function retrieveContext(query: string, k = 5, topicFilter?: string, minScore = 0.3) {
  const idx = await getIndex();
  const { embedTexts } = await import("./embeddings");
  const [qvec] = await embedTexts([query]);
  const raw = idx.store.search(qvec, k * 2, c => topicFilter ? c.topic.toLowerCase() === topicFilter.toLowerCase() : true);
  const filtered = raw.filter(r => r.score >= minScore).slice(0, k);
  const context = filtered.map(r => `• ${r.chunk.text_summary} (source: ${r.chunk.source.title} — ${r.chunk.source.url})`).join("\n");
  return { results: filtered, context };
}
 