export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const body = {
    has_SUPABASE_URL: !!process.env.SUPABASE_URL,
    has_SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
    url: process.env.SUPABASE_URL || null,
    node_env: process.env.NODE_ENV || null
  };
  return new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } });
} 