"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function TestSession() {
  const [email, setEmail] = useState<string | null>(null);
  const [count, setCount] = useState<string>("…");

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      const { data: userRes } = await supabase.auth.getUser();
      setEmail(userRes.user?.email ?? null);

      const { count: rowCount, error } = await supabase
        .from("learning_goals")
        .select("id", { count: "exact", head: true });

      setCount(error ? `error: ${error.message}` : String(rowCount ?? 0));
    })();
  }, []);

  return (
    <main className="p-6 space-y-2">
      <h1 className="text-xl font-semibold">Session Test</h1>
      <p>Signed in as: {email ?? "not signed in"}</p>
      <p>Visible learning_goals rows: {count}</p>
      <p className="text-sm text-gray-500">
        Tip: Sign in at <code>/auth</code> first, then reload this page.
      </p>
    </main>
  );
}

