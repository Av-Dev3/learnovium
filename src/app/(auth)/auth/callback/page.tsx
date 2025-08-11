"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

function AuthCallbackInner() {
  const router = useRouter();
  const qs = useSearchParams();
  const [msg, setMsg] = useState("Signing you in…");

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();
      const next = qs.get("next") || "/";
      const code = qs.get("code");
      const token_hash = qs.get("token_hash");
      const type =
        (qs.get("type") as "magiclink" | "signup" | "recovery" | "email_change") ||
        "magiclink";

      try {
        // 1) PKCE / code flow
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          router.replace(next);
          return;
        }

        // 2) Token hash flow (magic link, signup, recovery, email_change)
        if (token_hash) {
          const { error } = await supabase.auth.verifyOtp({ type, token_hash });
          if (error) throw error;
          router.replace(next);
          return;
        }

        // 3) Hash fragment flow (#access_token=...&refresh_token=...)
        if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
          const hash = window.location.hash.slice(1);
          const params = new URLSearchParams(hash);
          const access_token = params.get("access_token");
          const refresh_token = params.get("refresh_token");
          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token });
            if (error) throw error;
            router.replace(next);
            return;
          }
        }

        setMsg("No auth params found in the URL. Request a new magic link.");
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setMsg(err?.message || "Sign‑in failed. Try again.");
        setTimeout(() => router.replace("/auth"), 1500);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="p-6 text-sm">{msg}</div>;
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div className="p-6 text-sm">Loading…</div>}>
      <AuthCallbackInner />
    </Suspense>
  );
}
