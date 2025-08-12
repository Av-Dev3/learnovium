import { NextRequest, NextResponse } from "next/server";
import { retrieveContextDB } from "@/rag/retriever_db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "Beginner Python data types";
  const topic = searchParams.get("topic") ?? undefined;
  const k = Number(searchParams.get("k") || "5");
  try {
    const out = await retrieveContextDB(q, k, topic);
    return NextResponse.json(out);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "DB search failed", q, topic, k }, { status: 500 });
  }
} 