"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function RagImport() {
  const [email, setEmail] = useState<string | null>(null);
  const [out, setOut] = useState<{ status?: number; json?: unknown; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const sb = supabaseBrowser();
      const { data } = await sb.auth.getSession();
      setEmail(data.session?.user?.email ?? null);
    })();
  }, []);

  async function runImport() {
    setLoading(true); setOut(null);
    try {
      const sb = supabaseBrowser();
      const { data } = await sb.auth.getSession();
      const token = data.session?.access_token;
      const res = await fetch("/api/dev/rag/seed/import", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      const json = await res.json().catch(() => ({}));
      setOut({ status: res.status, json });
    } catch (e: unknown) {
      setOut({ error: e instanceof Error ? e.message : String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">RAG Seed Import</h1>
      <p className="text-sm">Signed in as: {email || "(not signed in)"}</p>
      <button onClick={runImport} disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">
        {loading ? "Importing…" : "Import seeds into DB"}
      </button>
      {out && <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">{JSON.stringify(out, null, 2)}</pre>}
    </main>
  );
} 