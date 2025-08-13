import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { embedTexts } from "@/rag/embeddings";
import { SEED_PACKS } from "../../../../../../../seed/registry";

/**
 * POST /api/dev/rag/seed/import
 * Auth: must be signed in; server-side policy allows only admin email to insert (see SQL).
 * Action: upserts topic_pack, source, chunk rows; computes embeddings for chunks.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supa = await supabaseServer(req);
    // Prove identity (optional hard gate by admin email here if you like)
    const { data: { user } } = await supa.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const report: Array<{
      pack: string;
      slug: string;
      pack_id: string;
      sourcesUpserted: number;
      chunksUpserted: number;
      chunkCount: number;
    }> = [];

    // Upsert packs
    for (const pack of SEED_PACKS) {
      // topic_pack
      const { data: packRow, error: pErr } = await supa
        .from("topic_pack")
        .upsert({ 
          slug: pack.id, 
          topic: pack.topic, 
          subtopic: pack.subtopic ?? null, 
          version: pack.version ?? "1", 
          locale: pack.locale ?? "en",
          ttl_days: null,
          created_at: new Date().toISOString(),
          created_by: user.id
        }, { onConflict: "slug" })
        .select("id, slug")
        .single();
      if (pErr) return NextResponse.json({ error: `topic_pack upsert: ${pErr.message}`, pack: pack.id }, { status: 400 });
      const pack_id = packRow.id as string;     // <-- uuid

      // Insert sources first (dedupe by url)
      const sourceMap = new Map<string, string>();
      let sourcesUpserted = 0;
      for (const ch of pack.chunks) {
        const key = ch.source.url;
        if (sourceMap.has(key)) continue;
        const { data: s, error: sErr } = await supa
          .from("source")
          .upsert(
            { url: ch.source.url, title: ch.source.title, author: ch.source.author ?? null, license: (ch.source as { url: string; title: string; author?: string; license?: string }).license ?? null },
            { onConflict: "url" }
          )
          .select("id")
          .single();
        if (sErr) return NextResponse.json({ error: `source upsert: ${sErr.message}` }, { status: 400 });
        sourceMap.set(key, s.id);
        sourcesUpserted++;
      }

      // Embed all chunk texts in this pack
      const texts = pack.chunks.map((c: { text_summary: string }) => c.text_summary);
      const vectors = await embedTexts(texts);

      // Upsert chunks with embeddings
      let chunksUpserted = 0;
      for (let i = 0; i < pack.chunks.length; i++) {
        const c: { 
          id: string; 
          topic: string; 
          subtopic?: string; 
          text_summary: string; 
          tags?: string[]; 
          source: { url: string; title: string; author?: string; license?: string } 
        } = pack.chunks[i];
        const vec = vectors[i];
        const source_id = sourceMap.get(c.source.url) ?? null;

        const { error: cErr } = await supa
          .from("chunk")
          .upsert({
            id: c.id,
            pack_id,
            topic: c.topic,
            subtopic: c.subtopic ?? null,
            text_summary: c.text_summary,
            tags: c.tags ?? [],
            source_id,
            embedding: vec, // number[] → vector
          })
          .select("id")
          .single();

        if (cErr) return NextResponse.json({ error: `chunk upsert: ${cErr.message}`, chunk_id: c.id }, { status: 400 });
        chunksUpserted++;
      }

      report.push({ pack: pack.id, slug: packRow.slug, pack_id, sourcesUpserted, chunksUpserted, chunkCount: pack.chunks.length });
    }

    return NextResponse.json({ ok: true, report });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Seed import failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 