import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function supabaseServer(req?: NextRequest) {
  const cookieStore = await cookies();
  const authHeader = req?.headers.get("authorization") || undefined; // "Bearer <token>"

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    }
  );
} 