"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

function AuthCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const code = params.get("code");
    const next = params.get("next") || "/";
    if (!code) return;

    (async () => {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      router.replace(error ? "/auth" : next);
    })();
  }, [params, router]);

  return <div className="p-6 text-sm">Signing you in…</div>;
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div className="p-6 text-sm">Loading…</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
} 