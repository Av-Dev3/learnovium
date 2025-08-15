import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });

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

  const { access_token, refresh_token } = await req.json().catch(() => ({} as { access_token?: string; refresh_token?: string }));
  if (!access_token || !refresh_token) {
    return NextResponse.json({ error: "missing tokens" }, { status: 400 });
  }

  // Set the session on the server (this will write the sb-* cookies to the response)
  const { error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return res;
} 