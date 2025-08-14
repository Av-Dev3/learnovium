import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/app";

  const res = NextResponse.redirect(new URL(next, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: { [key: string]: unknown }) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: { [key: string]: unknown }) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  if (!code) {
    // No code; punt back to /auth
    return NextResponse.redirect(new URL("/auth", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    // Bubble error to /auth (optional: include ?e=callback)
    return NextResponse.redirect(new URL("/auth?e=callback", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  }

  // Cookies are now set on the response; redirect to /app
  return res;
} 