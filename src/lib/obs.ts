type Usage = { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
type TrackArgs = { task: "planner"|"lesson"|"validator"; model: string; ms: number; usage?: Usage };

declare global {
  var __obsDaily: { date: string; tokens: number } | undefined;
}

function todayKey() {
  const d = new Date();
  return d.toISOString().slice(0,10);
}

export function track({ task, model, ms, usage }: TrackArgs) {
  const total = usage?.total_tokens ?? 0;
  const date = todayKey();
  if (!globalThis.__obsDaily || globalThis.__obsDaily.date !== date) {
    globalThis.__obsDaily = { date, tokens: 0 };
  }
  globalThis.__obsDaily.tokens += total;

  // You can plug real pricing here later; for now we log tokens only.
  const dailyTokens = globalThis.__obsDaily.tokens;
  console.log(`[OBS] task=${task} model=${model} latency_ms=${ms} tokens=${total} daily_tokens=${dailyTokens}`);
}

export function getDailyTokens() {
  const d = globalThis.__obsDaily;
  return d?.date === todayKey() ? d.tokens : 0;
} 