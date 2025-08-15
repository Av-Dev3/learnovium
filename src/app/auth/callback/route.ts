import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/app";

  // Redirect back to the SAME host that handled the request
  const dest = new URL(next, `${url.protocol}//${url.host}`);
  const backToAuth = new URL("/auth", `${url.protocol}//${url.host}`);
  const res = NextResponse.redirect(dest);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: { [key: string]: unknown }) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options: { [key: string]: unknown }) => {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  if (!code) return NextResponse.redirect(backToAuth);

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/auth?e=callback", backToAuth));

  return res; // cookies now set on SAME host
} 