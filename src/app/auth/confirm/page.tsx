"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function ConfirmHashCatcher() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      await supabase.auth.getSession(); // parse hash and store in client
      // Bridge to server cookies
      const { data } = await supabase.auth.getSession();
      const at = data.session?.access_token;
      const rt = data.session?.refresh_token;
      if (at && rt) {
        await fetch("/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: at, refresh_token: rt }),
        });
      }
      router.replace("/app");
    })();
  }, [router]);
  return <div className="p-6">Finalizing your sign‑in…</div>;
} 