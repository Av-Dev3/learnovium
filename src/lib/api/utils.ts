import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function requireUser(req: NextRequest) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return { user: null, supabase: null, res: NextResponse.json({ error: "Supabase env missing" }, { status: 500 }) };
  }
  const supabase = await supabaseServer();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { user: null, supabase, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user, supabase, res: null };
}

export function dayIndexFrom(startISO: string) {
  const start = new Date(startISO);
  const now = new Date();
  const ms = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
             Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  return Math.max(1, Math.floor(ms / 86400000) + 1);
} 