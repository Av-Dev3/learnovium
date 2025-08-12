import { InMemoryVectorStore } from "./store";
import { TopicPack } from "@/types/rag";
import { embedTexts } from "./embeddings";
import { SEED_PACKS } from "../../seed/registry";

export type RAGIndex = {
  store: InMemoryVectorStore;
  chunks: ReturnType<typeof TopicPack.parse>["chunks"];
};

export async function buildIndexFromSeeds() {
  const packs = SEED_PACKS.map((p) => TopicPack.parse(p));
  const allChunks = packs.flatMap((p) => p.chunks);
  if (allChunks.length === 0) throw new Error("No chunks found in seeds");

  const vectors = await embedTexts(allChunks.map((c) => c.text_summary));
  const dim = vectors[0]?.length ?? 1536;
  const store = new InMemoryVectorStore(dim);
  store.upsert(allChunks.map((c, i) => ({ id: c.id, vector: vectors[i], meta: c })));

  return { store, chunks: allChunks };
} 