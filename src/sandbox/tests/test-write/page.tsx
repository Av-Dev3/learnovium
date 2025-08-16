"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function TestWrite() {
  const [out, setOut] = useState("Ready. Click to run…");

  const run = async () => {
    const supabase = supabaseBrowser();

    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes.user) {
      setOut("Not signed in. Go to /auth first.");
      return;
    }

    const { error: insErr } = await supabase.from("learning_goals").insert({
      user_id: userRes.user.id,
      topic: "Supabase Smoke Test",
      focus: "Confirm connection",
    });
    if (insErr) {
      setOut(`Insert error: ${insErr.message}`);
      return;
    }

    const { data, error: selErr } = await supabase
      .from("learning_goals")
      .select("id, topic, created_at")
      .order("created_at", { ascending: false })
      .limit(3);

    if (selErr) {
      setOut(`Select error: ${selErr.message}`);
    } else {
      setOut(`OK. Latest goals: ${data.map((d: { topic: string }) => d.topic).join(", ")}`);
    }
  };

  return (
    <main className="p-6 space-y-3 text-sm">
      <button
        onClick={run}
        className="rounded bg-black text-white px-4 py-2"
      >
        Run DB write/read test
      </button>
      <div>{out}</div>
      <p className="text-xs text-gray-500">
        Tip: Sign in at <code>/auth</code> first, then reload this page.
      </p>
    </main>
  );
}

