// app/auth/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [envOk, setEnvOk] = useState<boolean>(true);

  useEffect(() => {
    // Quick sanity: if NEXT_PUBLIC_* are missing in the browser, tell user
    const has =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    setEnvOk(has);
  }, []);

  const sendMagic = async () => {
    setStatus("Sending…");
    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: true,
        },
      });
      setStatus(error ? `Auth error: ${error.message}` : "Magic link sent. Check your email.");
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setStatus(`Client error: ${errorMessage}`);
    }
  };

  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-3">
        <h1 className="text-xl font-semibold">Sign in</h1>

        {!envOk && (
          <p className="text-sm text-red-600">
            Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (browser env).
          </p>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border rounded px-3 py-2"
        />
        <button
          onClick={sendMagic}
          className="w-full rounded bg-black text-white py-2 disabled:opacity-60"
          disabled={!email}
        >
          Send magic link
        </button>
        {status && <p className="text-sm">{status}</p>}
        <p className="text-xs opacity-70">
          Redirect will be: <code>{typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "…"}</code>
        </p>
      </div>
    </main>
  );
}
