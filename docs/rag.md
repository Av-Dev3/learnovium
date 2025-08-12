# RAG Implementation

We use "Topic Packs" (curated summaries) → chunk → embed → retrieve top-k by cosine.

## Architecture

- **Cheap mode**: in-memory store (rag/store.ts) + JSON seed (seed/topic_packs/*.json).
- **Later**: we can swap to Supabase pgvector with the same interface.

## Flow

1. Topic Packs are curated summaries of learning materials
2. Content is chunked into smaller pieces
3. Chunks are embedded using OpenAI embeddings
4. Retrieval finds top-k matches by cosine similarity
5. Results are used to enhance AI responses with relevant context 