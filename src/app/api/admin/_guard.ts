/**
 * Admin API Guard Middleware
 * Ensures only admin users can access admin endpoints
 */

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n:string)=>cookieStore.get(n)?.value, set(){}, remove(){} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok:false, status:401 as const };
  const { data: p } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!p?.is_admin) return { ok:false, status:403 as const };
  return { ok:true, user };
}

/**
 * Middleware wrapper for admin routes
 */
export function withAdminGuard(
  handler: (req: NextRequest, context: unknown, user: { id: string; email?: string }) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: unknown) => {
    const guard = await requireAdmin();
    
    if (!guard.ok) {
      return NextResponse.json({ error: "Authentication required" }, { status: guard.status });
    }
    
    // At this point guard.user is guaranteed to exist
    const user = guard.user!;
    return handler(req, context, { id: user.id, email: user.email });
  };
}
