import { NextResponse } from "next/server";
import { retrieveContext } from "@/rag/retriever";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "Beginner Python data types";
  const topic = searchParams.get("topic") ?? undefined;
  const k = Number(searchParams.get("k") || "4");
  const out = await retrieveContext(q, k, topic);
  return NextResponse.json(out);
} 