"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import Link from "next/link";

type Mode = "magic" | "signin" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function bridgeSession() {
    const supabase = supabaseBrowser();
    const { data } = await supabase.auth.getSession();
    const at = data.session?.access_token;
    const rt = data.session?.refresh_token;
    if (!at || !rt) return false;
    const r = await fetch("/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: at, refresh_token: rt }),
    });
    return r.ok;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setPending(true);
    const supabase = supabaseBrowser();

    try {
      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: "https://www.learnovium.com/auth/callback",
          },
        });
        if (error) throw error;
        setMsg("Magic link sent. Check your email.");
        return;
      }

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: "https://www.learnovium.com/auth/callback",
          },
        });
        if (error) throw error;
        setMsg("Account created. Check your email to confirm (if required).");
        return;
      }

      // mode === "signin": email + password
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Bridge client session -> server cookies
      const ok = await bridgeSession();
      if (!ok) throw new Error("Could not set server session");
      window.location.href = "/app";
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Authentication failed.";
      setErr(errorMessage);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Sign in</h1>

        <div className="flex gap-2">
          <button onClick={() => setMode("signin")} className={`px-3 py-1 rounded-lg border ${mode==="signin" ? "bg-black text-white" : ""}`}>Email + Password</button>
          <button onClick={() => setMode("signup")} className={`px-3 py-1 rounded-lg border ${mode==="signup" ? "bg-black text-white" : ""}`}>Create Account</button>
          <button onClick={() => setMode("magic")} className={`px-3 py-1 rounded-lg border ${mode==="magic" ? "bg-black text-white" : ""}`}>Magic Link</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-lg border px-3 py-2" />
          {mode !== "magic" && (
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode==="signup" ? "Create a password" : "Your password"} className="w-full rounded-lg border px-3 py-2" />
          )}
          <button disabled={pending} type="submit" className="w-full rounded-lg px-3 py-2 bg-black text-white disabled:opacity-50">
            {pending ? "Please wait…" : mode === "magic" ? "Send Magic Link" : mode === "signup" ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {mode === "signin" && <div className="text-sm"><Link href="/auth/reset" className="underline">Forgot your password?</Link></div>}
        {err && <p className="text-sm text-red-600">{err}</p>}
        {msg && <p className="text-sm text-green-600">{msg}</p>}
      </div>
    </main>
  );
} 