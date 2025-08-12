import { TChunk } from "@/types/rag";

export type Vec = number[];
export type VecItem = { id: string; vector: Vec; meta: TChunk };

function dot(a: Vec, b: Vec) { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }
function norm(a: Vec) { return Math.sqrt(dot(a, a)); }
function cosine(a: Vec, b: Vec) { const na = norm(a), nb = norm(b); return na && nb ? dot(a,b)/(na*nb) : 0; }

export class InMemoryVectorStore {
  private dim = 0;
  private items: VecItem[] = [];

  constructor(dim: number) { this.dim = dim; }

  upsert(batch: VecItem[]) {
    for (const v of batch) {
      if (v.vector.length !== this.dim) throw new Error(`Dim mismatch: got ${v.vector.length} expected ${this.dim}`);
      const idx = this.items.findIndex(i => i.id === v.id);
      if (idx >= 0) this.items[idx] = v; else this.items.push(v);
    }
  }

  search(query: Vec, k = 5, filter?: (c: TChunk) => boolean) {
    const scored = this.items
      .filter(it => (filter ? filter(it.meta) : true))
      .map(it => ({ it, score: cosine(query, it.vector) }));
    scored.sort((a,b) => b.score - a.score);
    return scored.slice(0, k).map(s => ({ id: s.it.id, score: s.score, chunk: s.it.meta }));
  }

  count() { return this.items.length; }
} 