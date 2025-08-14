"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function ClientBlock() {
  const [state, setState] = useState<{
    loading: boolean;
    clientSession: unknown;
    clientUser: unknown;
  }>({ loading: true, clientSession: null, clientUser: null });

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      const { data: sessionData } = await supabase.auth.getSession();
      const { data: userData } = await supabase.auth.getUser();
      setState({
        loading: false,
        clientSession: sessionData?.session ?? null,
        clientUser: userData?.user ?? null,
      });
    })();
  }, []);

  return (
    <div className="rounded-xl border p-4">
      <h2 className="font-medium mb-2">Client-side session & user</h2>
      <pre className="text-sm overflow-auto">
{JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
} 