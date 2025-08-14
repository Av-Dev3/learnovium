import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/app";

  if (!code) {
    // No code; punt back to /auth
    return NextResponse.redirect(new URL("/auth", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  }

  // Create a response that we can set cookies on
  const res = NextResponse.next();

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

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    // Bubble error to /auth (optional: include ?e=callback)
    return NextResponse.redirect(new URL("/auth?e=callback", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  }

  // Now redirect with the cookies set
  const redirectUrl = new URL(next, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
  const finalRes = NextResponse.redirect(redirectUrl);
  
  // Copy cookies from the response that has the session cookies
  res.cookies.getAll().forEach(cookie => {
    finalRes.cookies.set(cookie);
  });

  return finalRes;
} 