"use client";
import { useState } from "react";

export default function GoalTester() {
  const [topic, setTopic] = useState("Python");
  const [focus, setFocus] = useState("lists vs tuples for beginners");
  const [goalId, setGoalId] = useState("");
  const [output, setOutput] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  async function createGoal() {
    setLoading(true);
    setOutput(null);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, focus }),
      });
      const data = await res.json();
      if (res.ok) {
        setGoalId(data.id);
        setOutput({ created_goal: data });
      } else {
        setOutput({ error: data });
      }
    } finally {
      setLoading(false);
    }
  }

  async function runLesson() {
    if (!goalId) return;
    setLoading(true);
    setOutput(null);
    try {
      const res = await fetch(`/api/goals/${goalId}/today`);
      const data = await res.json();
      setOutput({ lesson: data });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dev Goal Tester</h1>
      <div className="space-y-2">
        <label className="block">
          Topic:
          <input
            className="border px-2 py-1 rounded w-full"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </label>
        <label className="block">
          Focus:
          <input
            className="border px-2 py-1 rounded w-full"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
          />
        </label>
      </div>
      <div className="flex gap-2">
        <button
          onClick={createGoal}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          Create Goal
        </button>
        <button
          onClick={runLesson}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading || !goalId}
        >
          Run Today&apos;s Lesson
        </button>
      </div>
      {goalId && (
        <p className="text-sm">
          Goal ID: <code>{goalId}</code>
        </p>
      )}
      {loading && <p>Loading...</p>}
      {output && (
        <pre className="bg-gray-100 p-3 rounded overflow-auto text-xs">
          {JSON.stringify(output, null, 2)}
        </pre>
      )}
    </main>
  );
} 