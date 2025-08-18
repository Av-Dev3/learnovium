"use server";

import { cookies } from "next/headers";
// import { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function supabaseServer() {
  try {
    // Pull cookies in/out for SSR so session is available in RSC
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            try {
              return cookieStore.getAll().map(cookie => ({
                name: cookie.name,
                value: cookie.value,
              }));
            } catch (error) {
              console.warn("Error getting cookies:", error);
              return [];
            }
          },
          setAll(cookies: { name: string; value: string; options: CookieOptions }[]) {
            try {
              cookies.forEach(({ name, value, options }) => {
                try {
                  cookieStore.set({ name, value, ...options });
                } catch (error) {
                  console.warn("Error setting cookie:", error);
                }
              });
            } catch (error) {
              console.warn("Error setting cookies:", error);
            }
          },
        },
      }
    );

    return supabase;
  } catch (error) {
    console.error("Error creating Supabase server client:", error);
    throw error;
  }
}