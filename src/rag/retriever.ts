import { buildIndexFromSeeds, RAGIndex } from "./indexer";

let indexPromise: Promise<RAGIndex> | null = null;

// Lazy global index to avoid rebuilding on each request
export function getIndex() {
  if (!indexPromise) indexPromise = buildIndexFromSeeds();
  return indexPromise;
}

export async function retrieveContext(query: string, k = 5, topicFilter?: string) {
  const idx = await getIndex();
  // Embed query using the same model
  const { embedTexts } = await import("./embeddings");
  const [qvec] = await embedTexts([query]);
  const results = idx.store.search(qvec, k, c => topicFilter ? c.topic.toLowerCase() === topicFilter.toLowerCase() : true);
  const context = results.map(r => `• ${r.chunk.text_summary} (source: ${r.chunk.source.title} — ${r.chunk.source.url})`).join("\n");
  return { results, context };
} 