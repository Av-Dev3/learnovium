import { InMemoryVectorStore } from "./store";
import { TTopicPack, TopicPack } from "@/types/rag";
import fs from "node:fs";
import path from "node:path";
import { embedTexts } from "./embeddings";

export type RAGIndex = {
  store: InMemoryVectorStore;
  chunks: ReturnType<typeof TopicPack.parse>["chunks"];
};

export async function buildIndexFromSeeds(dir = "seed/topic_packs") {
  // Load all JSON packs
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
  const packs: TTopicPack[] = files.map(f => {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    return TopicPack.parse(JSON.parse(raw));
  });

  const allChunks = packs.flatMap(p => p.chunks);
  if (allChunks.length === 0) throw new Error("No chunks found in seeds");

  // Embed
  const vectors = await embedTexts(allChunks.map(c => c.text_summary));
  const dim = vectors[0]?.length ?? 1536;
  const store = new InMemoryVectorStore(dim);
  store.upsert(
    allChunks.map((c, i) => ({ id: c.id, vector: vectors[i], meta: c }))
  );

  return { store, chunks: allChunks } as RAGIndex;
} 