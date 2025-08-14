import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (!pathname.startsWith("/app")) return NextResponse.next();

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

  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/app/:path*"],
}; 