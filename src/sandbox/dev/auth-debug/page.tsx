"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import type { Session, User } from "@supabase/supabase-js";

export default function AuthDebug() {
  const [clientSess, setClientSess] = useState<Session | null>(null);
  const [me, setMe] = useState<User | { error: string } | null>(null);
  const [cookies, setCookies] = useState<string>("(loading)");

  useEffect(() => {
    (async () => {
      try {
        const sb = supabaseBrowser();
        const s = await sb.auth.getSession();
        setClientSess(s.data.session || null);
      } catch (e) { 
        setClientSess(null); 
        console.error("Session error:", e);
      }
      try {
        const m = await fetch("/api/dev/supa/me").then(r => r.json());
        setMe(m);
      } catch (e) { 
        setMe({ error: String(e) }); 
      }
      setCookies(typeof document !== "undefined" ? document.cookie : "(no document)");
    })();
  }, []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Auth Debug</h1>
      <section>
        <h2 className="font-medium">Client getSession()</h2>
        <pre className="bg-gray-100 p-3 text-xs rounded overflow-auto">{JSON.stringify(clientSess, null, 2)}</pre>
      </section>
      <section>
        <h2 className="font-medium">Server getUser()</h2>
        <pre className="bg-gray-100 p-3 text-xs rounded overflow-auto">{JSON.stringify(me, null, 2)}</pre>
      </section>
      <section>
        <h2 className="font-medium">document.cookie</h2>
        <pre className="bg-gray-100 p-3 text-xs rounded overflow-auto">{cookies}</pre>
      </section>
      <p className="text-sm opacity-70">
        Probes: <a className="underline" href="/api/dev/supa/env">/api/dev/supa/env</a> • <a className="underline" href="/api/dev/supa/session">/api/dev/supa/session</a> • <a className="underline" href="/api/dev/cookies">/api/dev/cookies</a>
      </p>
    </main>
  );
}

