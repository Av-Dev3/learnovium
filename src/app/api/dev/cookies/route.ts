import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const c = await cookies();
  // Supabase sets several cookies starting with 'sb-' or '__Secure-'
  const names = c.getAll().map(x => x.name);
  return NextResponse.json({ cookies: names });
} 