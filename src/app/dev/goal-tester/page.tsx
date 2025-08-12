"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

function useAccessToken() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const sb = supabaseBrowser();
      const { data } = await sb.auth.getSession();
      setToken(data.session?.access_token ?? null);
      setEmail(data.session?.user?.email ?? null);
    })();
  }, []);
  return { token, email };
}

async function toJSON(res: Response) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { raw: text || null }; }
}

export default function GoalTester() {
  const [topic, setTopic] = useState("Python");
  const [focus, setFocus] = useState("lists vs tuples for beginners");
  const [goalId, setGoalId] = useState("");
  const [output, setOutput] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const { token, email } = useAccessToken();

  async function createGoal() {
    setLoading(true);
    setOutput(null);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ topic, focus }),
      });
      const data = await toJSON(res);
      if (res.ok && data?.id) { setGoalId(data.id); setOutput({ created_goal: data }); }
      else { setOutput({ error: true, status: res.status, data }); }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setOutput({ error: true, message: errorMessage });
    } finally { setLoading(false); }
  }

  async function runLesson() {
    if (!goalId) return;
    setLoading(true);
    setOutput(null);
    try {
      const res = await fetch(`/api/goals/${goalId}/today`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await toJSON(res);
      if (res.ok) setOutput({ lesson: data });
      else setOutput({ error: true, status: res.status, data });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setOutput({ error: true, message: errorMessage });
    } finally { setLoading(false); }
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dev Goal Tester</h1>
      <p className="text-sm">
        Session: {email ? <span className="text-green-600">signed in as {email}</span> : <span className="text-red-600">not signed in</span>}
      </p>
      <div className="space-y-2">
        <label className="block">Topic:<input className="border px-2 py-1 rounded w-full" value={topic} onChange={(e) => setTopic(e.target.value)} /></label>
        <label className="block">Focus:<input className="border px-2 py-1 rounded w-full" value={focus} onChange={(e) => setFocus(e.target.value)} /></label>
      </div>
      <div className="flex gap-2">
        <button onClick={createGoal} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading || !token}>
          Create Goal
        </button>
        <button onClick={runLesson} className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading || !goalId || !token}>
          Run Today&apos;s Lesson
        </button>
      </div>
      {goalId && <p className="text-sm">Goal ID: <code>{goalId}</code></p>}
      {loading && <p>Loading...</p>}
      {output && <pre className="bg-gray-100 p-3 rounded overflow-auto text-xs">{JSON.stringify(output, null, 2)}</pre>}
    </main>
  );
} 