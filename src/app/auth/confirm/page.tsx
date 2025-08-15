"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function ConfirmHashCatcher() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      await supabase.auth.getSession(); // parses URL hash on first call
      router.replace("/app");
    })();
  }, [router]);
  return <div className="p-6">Finalizing your sign‑in…</div>;
} 