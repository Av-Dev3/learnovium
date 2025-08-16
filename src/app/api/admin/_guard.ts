/**
 * Admin API Guard Middleware
 * Ensures only admin users can access admin endpoints
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export interface AdminGuardResult {
  ok: boolean;
  status: number;
  user?: {
    id: string;
    email?: string;
  };
  response?: NextResponse;
}

/**
 * Require admin access for API endpoints
 * Returns user info if authorized, or error response if not
 */
export async function requireAdmin(_req: NextRequest): Promise<AdminGuardResult> {
  try {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        ok: false,
        status: 401,
        response: NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        ),
      };
    }

    // Check if user has admin privileges
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return {
        ok: false,
        status: 500,
        response: NextResponse.json(
          { error: "Failed to verify admin status" },
          { status: 500 }
        ),
      };
    }

    if (!profile?.is_admin) {
      return {
        ok: false,
        status: 403,
        response: NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        ),
      };
    }

    return {
      ok: true,
      status: 200,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Admin guard error:", error);
    return {
      ok: false,
      status: 500,
      response: NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      ),
    };
  }
}

/**
 * Middleware wrapper for admin routes
 */
export function withAdminGuard(
  handler: (req: NextRequest, context: unknown, user: { id: string; email?: string }) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: unknown) => {
    const guard = await requireAdmin(req);
    
    if (!guard.ok) {
      return guard.response!;
    }
    
    return handler(req, context, guard.user!);
  };
}
