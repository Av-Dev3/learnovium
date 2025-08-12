export default function Home() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">LearnovAI — Dev Utilities</h1>
      <ul className="list-disc pl-6">
        <li><a className="underline" href="/api/dev/health">/api/dev/health</a></li>
        <li><a className="underline" href="/api/dev/env">/api/dev/env</a></li>
        <li><a className="underline" href="/api/dev/ai/plan">/api/dev/ai/plan</a></li>
        <li><a className="underline" href="/api/dev/ai/lesson">/api/dev/ai/lesson</a></li>
        <li><a className="underline" href="/api/dev/rag/search?q=Python%20loops&topic=Python&k=3">/api/dev/rag/search</a></li>
        <li><a className="underline" href="/api/goals">/api/goals (GET)</a></li>
        <li><a className="underline" href="/api/progress">/api/progress (POST via REST client)</a></li>
        <li><a className="underline" href="/api/dev/supa/env">/api/dev/supa/env</a></li>
        <li><a className="underline" href="/api/dev/supa/me">/api/dev/supa/me</a></li>
      </ul>
      <p className="text-sm opacity-70">Dev-only links. Remove before prod.</p>
      <p className="text-sm">To test today&apos;s lesson cache: create a goal, then GET /api/goals/:id/today</p>
    </main>
  );
}
