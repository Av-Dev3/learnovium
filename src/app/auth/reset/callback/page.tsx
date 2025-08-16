"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function ResetCallbackPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null); setPending(true);
    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMsg("Password updated. Redirecting to sign in…");
      setTimeout(() => router.replace("/auth"), 1200);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setErr(errorMessage);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Choose a new password</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="password"
            required
            placeholder="New password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
          <button
            disabled={pending}
            className="w-full rounded-lg px-3 py-2 bg-black text-white disabled:opacity-50"
          >
            {pending ? "Updating…" : "Update password"}
          </button>
        </form>
        {err && <p className="text-sm text-red-600">{err}</p>}
        {msg && <p className="text-sm text-green-600">{msg}</p>}
      </div>
    </main>
  );
} 