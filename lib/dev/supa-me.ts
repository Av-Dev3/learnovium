import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
export const runtime = "nodejs";
export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase.auth.getUser();
  return NextResponse.json({ user: data?.user || null, error: error?.message || null });
} 