export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/_guard";
import { invalidateConfigCache } from "@/lib/aiGuard";

export async function POST() {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error:"forbidden" }, { status: gate.status });
  invalidateConfigCache();
  return NextResponse.json({ ok:true });
}
