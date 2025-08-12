import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function requireUser(_req: NextRequest) {
  const supabase = supabaseServer();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { user: null as const, supabase, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  return { user, supabase, res: null as const };
}

export function dayIndexFrom(startISO: string, _tz = "UTC") {
  // Coarse day index for caching lessons per day/goal
  const start = new Date(startISO);
  const now = new Date();
  const ms = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
             Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  return Math.max(1, Math.floor(ms / (24 * 3600 * 1000)) + 1);
} 