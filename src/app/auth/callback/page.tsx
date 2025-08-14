"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

function AuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const code = params.get("code");
      const next = params.get("next") || "/app";
      if (!code) {
        setErr("Missing auth code");
        router.replace("/auth");
        return;
      }
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setErr(error.message);
        router.replace("/auth?e=callback");
      } else {
        // Force navigation to /app to trigger middleware w/ fresh cookies
        window.location.replace(next);
      }
    })();
  }, [params, router]);

  return (
    <div className="p-6">
      Signing you in… {err && <span className="text-red-600">({err})</span>}
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <AuthCallbackInner />
    </Suspense>
  );
}

