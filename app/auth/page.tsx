"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const sendMagic = async () => {
    setStatus("Sending…");
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Always redirect back to the live domain's callback
        emailRedirectTo: `https://learnovai.vercel.app/auth/callback`,
      },
    });
    setStatus(error ? `Error: ${error.message}` : "Magic link sent. Check your email.");
  };

  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-3">
        <h1 className="text-xl font-semibold">Sign in</h1>
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
      </div>
    </main>
  );
} 