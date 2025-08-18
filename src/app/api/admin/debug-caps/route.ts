export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_guard";
import { loadConfig } from "@/lib/aiGuard";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error:"forbidden" }, { status: gate.status });
  const cfg = await loadConfig(0); // bypass cache
  return NextResponse.json(cfg);
}
