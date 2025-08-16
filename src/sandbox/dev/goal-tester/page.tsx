"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type Goal = { id: string; topic: string; focus: string | null; plan_version?: number; created_at?: string };

type OutputState = {
  plan?: Record<string, unknown>;
  lesson?: Record<string, unknown>;
  goals?: Goal[];
  error?: boolean;
  status?: number;
  data?: unknown;
  created_goal?: Record<string, unknown>;
} | null;

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

function Pretty({ data }: { data: unknown }) {
  if (!data) return null;
  return <pre className="bg-gray-100 p-3 rounded overflow-auto text-xs">{JSON.stringify(data, null, 2)}</pre>;
}

export default function GoalTester() {
  const { token, email } = useAccessToken();
  const [topic, setTopic] = useState("Python");
  const [focus, setFocus] = useState("lists vs tuples for beginners");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalId, setGoalId] = useState("");
  const [output, setOutput] = useState<OutputState>(null);
  const [loading, setLoading] = useState(false);

  const headers = useMemo(() => (
    token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } as Record<string,string>
          : { "Content-Type": "application/json" } as Record<string,string>
  ), [token]);

  const refreshGoals = useCallback(async () => {
    setLoading(true);
    setOutput(null);
    try {
      const res = await fetch("/api/goals", { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      const data = await toJSON(res);
      if (res.ok && Array.isArray(data)) {
        setGoals(data);
        if (!goalId && data[0]?.id) setGoalId(data[0].id);
        setOutput({ goals: data });
      } else {
        setOutput({ error: true, status: res.status, data });
      }
    } finally { setLoading(false); }
  }, [token, goalId]);

  async function createGoal() {
    setLoading(true); setOutput(null);
    try {
      const res = await fetch("/api/goals", { method: "POST", headers, body: JSON.stringify({ topic, focus }) });
      const data = await toJSON(res);
      if (res.ok && data?.id) {
        setGoalId(data.id);
        await refreshGoals();
        setOutput({ created_goal: data });
      } else {
        setOutput({ error: true, status: res.status, data });
      }
    } finally { setLoading(false); }
  }

  async function runToday() {
    if (!goalId) return;
    setLoading(true); setOutput(null);
    try {
      const res = await fetch(`/api/goals/${goalId}/today`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      const data = await toJSON(res);
      setOutput(res.ok ? { lesson: data } : { error: true, status: res.status, data });
    } finally { setLoading(false); }
  }

  async function genPlan(force = false) {
    if (!goalId) return;
    setLoading(true); setOutput(null);
    try {
      const url = `/api/goals/${goalId}/plan` + (force ? "?force=true" : "");
      const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      const data = await toJSON(res);
      setOutput(res.ok ? { plan: data } : { error: true, status: res.status, data });
    } finally { setLoading(false); }
  }

  useEffect(() => { if (token) refreshGoals(); }, [token, refreshGoals]);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dev Goal Tester</h1>
      <p className="text-sm">
        Session: {email ? <span className="text-green-600">signed in as {email}</span> : <span className="text-red-600">not signed in</span>}
      </p>

      <section className="space-y-2">
        <h2 className="font-semibold">Create Goal</h2>
        <label className="block">Topic:<input className="border px-2 py-1 rounded w-full" value={topic} onChange={(e) => setTopic(e.target.value)} /></label>
        <label className="block">Focus:<input className="border px-2 py-1 rounded w-full" value={focus} onChange={(e) => setFocus(e.target.value)} /></label>
        <button onClick={createGoal} className="bg-blue-500 text-white px-3 py-2 rounded disabled:opacity-50" disabled={loading || !token}>Create Goal</button>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Your Goals</h2>
        <div className="flex items-center gap-2">
          <button onClick={refreshGoals} className="bg-gray-200 px-3 py-2 rounded">Refresh</button>
          <select className="border px-2 py-1 rounded" value={goalId} onChange={(e) => setGoalId(e.target.value)}>
            <option value="">Select a goal…</option>
            {goals.map(g => (
              <option key={g.id} value={g.id}>{g.topic} {g.focus ? `— ${g.focus}` : ""}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={() => genPlan(false)} className="bg-purple-500 text-white px-3 py-2 rounded disabled:opacity-50" disabled={!goalId || !token || loading}>Get Plan</button>
          <button onClick={() => genPlan(true)} className="bg-purple-700 text-white px-3 py-2 rounded disabled:opacity-50" disabled={!goalId || !token || loading}>Rebuild Plan</button>
          <button onClick={runToday} className="bg-green-600 text-white px-3 py-2 rounded disabled:opacity-50" disabled={!goalId || !token || loading}>Fetch Today</button>
        </div>
      </section>

      {goalId && <p className="text-sm">Goal ID: <code>{goalId}</code></p>}

      {loading && <p>Loading…</p>}

      {output?.plan && (
        <section>
          <h3 className="font-semibold">Plan (PlanJSON)</h3>
          <Pretty data={output.plan} />
        </section>
      )}
      {output?.lesson && (
        <section>
          <h3 className="font-semibold">Lesson (LessonJSON)</h3>
          <Pretty data={output.lesson} />
        </section>
      )}
      {output?.goals && (
        <section>
          <h3 className="font-semibold">Goals</h3>
          <Pretty data={output.goals} />
        </section>
      )}
      {output?.error && (
        <section>
          <h3 className="font-semibold text-red-600">Error</h3>
          <Pretty data={output} />
        </section>
      )}
    </main>
  );
}

