"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

interface SummaryData {
  total_cost_usd: number;
  success_calls: number;
  error_calls: number;
}

interface AdminConfig {
  daily_user_budget_usd: number;
  daily_global_budget_usd: number;
  disable_endpoints: string[];
}

interface EndpointData {
  endpoint: string;
  spend: number;
  calls: number;
}

interface TopUserData {
  user_id: string;
  total_cost_usd: number;
  [key: string]: unknown;
}

interface LogData {
  created_at: string;
  endpoint: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost_usd: number;
  success: boolean;
  latency_ms: number;
  error_text?: string;
  [key: string]: unknown;
}

interface ChartDataPoint {
  ts: string;
  cost: number;
  errors: number;
}

function toCSV<T extends Record<string, unknown>>(rows: T[]) { 
  if (!rows?.length) return ""; 
  const h = Object.keys(rows[0]); 
  const esc = (v: unknown) => v == null ? "" : /["\n,]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v); 
  return [h.join(","), ...rows.map(r => h.map(k => esc(r[k as keyof T])).join(","))].join("\n"); 
}

export default function MetricsClient() {
  const sb = supabaseBrowser();
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [cfg, setCfg] = useState<AdminConfig | null>(null);
  const [endpoints, setEndpoints] = useState<EndpointData[]>([]);
  const [top, setTop] = useState<TopUserData[]>([]);
  const [logs, setLogs] = useState<LogData[]>([]);
  const [endpointFilter, setEndpointFilter] = useState<string>("");

  const loadAll = useCallback(async () => {
    // views/tables are protected by RLS: only is_admin can read
    const [{ data: s }, { data: acfg }] = await Promise.all([
      sb.from("v_ai_spend_summary").select("*").maybeSingle(),
      sb.from("admin_config").select("daily_user_budget_usd,daily_global_budget_usd,disable_endpoints").eq("id", 1).single()
    ]);
    setSummary(s || null);
    setCfg(acfg || null);

    const { data: tu } = await sb.from("v_top_users_today").select("*");
    setTop(tu || []);

    let q = sb.from("ai_call_log")
      .select("created_at,endpoint,model,prompt_tokens,completion_tokens,total_tokens,cost_usd,success,latency_ms,error_text")
      .order("created_at", { ascending: false })
      .limit(300);
    if (endpointFilter) q = q.eq("endpoint", endpointFilter);
    const { data: lg } = await q;
    setLogs(lg || []);

    // endpoints breakdown (today)
    const { data: ep } = await sb
      .from("ai_call_log")
      .select("endpoint, cost_usd")
      .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString());
    const map = new Map<string, { endpoint: string, spend: number, calls: number }>();
    (ep || []).forEach((r: { endpoint: string; cost_usd: number }) => {
      const m = map.get(r.endpoint) || { endpoint: r.endpoint, spend: 0, calls: 0 };
      m.spend += Number(r.cost_usd || 0); m.calls += 1; map.set(r.endpoint, m);
    });
    setEndpoints(Array.from(map.values()));
  }, [sb, endpointFilter]);

  useEffect(() => { 
    loadAll(); 
    const id = setInterval(loadAll, 10000); 
    return () => clearInterval(id); 
  }, [loadAll]);

  const chartData = useMemo((): ChartDataPoint[] => {
    const m = new Map<string, { ts: string; cost: number; errors: number }>();
    logs.forEach((r: LogData) => {
      const d = new Date(r.created_at); d.setSeconds(0, 0);
      const k = d.toISOString();
      const cur = m.get(k) || { ts: k, cost: 0, errors: 0 };
      cur.cost += Number(r.cost_usd || 0);
      if (!r.success) cur.errors += 1;
      m.set(k, cur);
    });
    return Array.from(m.values()).sort((a, b) => a.ts.localeCompare(b.ts));
  }, [logs]);

  async function saveCfg(patch: Partial<AdminConfig>) {
    // Direct update to admin_config (RLS allows admin update)
    await sb.from("admin_config").update(patch).eq("id", 1);
    await loadAll();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <select 
            className="border rounded px-2 py-1 text-sm bg-background" 
            value={endpointFilter} 
            onChange={e => setEndpointFilter(e.target.value)}
          >
            <option value="">All endpoints</option>
            <option value="planner">planner</option>
            <option value="lesson">lesson</option>
            <option value="validator">validator</option>
          </select>
          <Button variant="outline" onClick={loadAll}>Refresh</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Today&apos;s Global Spend</div>
          <div className="text-3xl font-bold mt-1">${Number(summary?.total_cost_usd || 0).toFixed(4)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Calls (Success)</div>
          <div className="text-3xl font-bold mt-1">{summary?.success_calls ?? 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Calls (Errors)</div>
          <div className="text-3xl font-bold mt-1">{summary?.error_calls ?? 0}</div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="text-sm text-muted-foreground mb-3">Endpoint Breakdown (today)</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={endpoints}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="endpoint" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="spend" name="Spend ($)" />
            <Bar dataKey="calls" name="Calls" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4">
        <div className="text-sm text-muted-foreground mb-3">Live Spend & Errors (per minute)</div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ts" tickFormatter={(v) => new Date(v).toLocaleTimeString()} />
            <YAxis />
            <Tooltip labelFormatter={(v) => new Date(v as string).toLocaleTimeString()} />
            <Legend />
            <Line type="monotone" dataKey="cost" name="Cost ($)" dot={false} />
            <Line type="monotone" dataKey="errors" name="Errors" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-muted-foreground">Top Users (today)</div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const csv = toCSV(top);
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob); 
                const a = document.createElement("a");
                a.href = url; 
                a.download = "top-users-today.csv"; 
                a.click(); 
                URL.revokeObjectURL(url);
              }}
            >
              Export CSV
            </Button>
          </div>
          <div className="space-y-2">
            {(top || []).map((r: TopUserData, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="truncate">{r.user_id}</div>
                <div className="font-medium">${Number(r.total_cost_usd || 0).toFixed(4)}</div>
              </div>
            ))}
            {(!top || top.length === 0) && <div className="text-sm text-muted-foreground">No data yet.</div>}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-muted-foreground">Recent Logs</div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const csv = toCSV(logs);
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob); 
                const a = document.createElement("a");
                a.href = url; 
                a.download = "recent-logs.csv"; 
                a.click(); 
                URL.revokeObjectURL(url);
              }}
            >
              Export CSV
            </Button>
          </div>
          <div className="max-h-[340px] overflow-auto text-sm">
            <table className="w-full">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="text-left p-1">Time</th>
                  <th className="text-left p-1">Endpoint</th>
                  <th className="text-left p-1">Model</th>
                  <th className="text-right p-1">Tokens</th>
                  <th className="text-right p-1">Cost</th>
                  <th className="text-right p-1">ms</th>
                  <th className="text-left p-1">Err</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((r: LogData, i: number) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-1">{new Date(r.created_at).toLocaleTimeString()}</td>
                    <td className="p-1">{r.endpoint}</td>
                    <td className="p-1">{r.model}</td>
                    <td className="p-1 text-right">{r.total_tokens}</td>
                    <td className="p-1 text-right">${Number(r.cost_usd || 0).toFixed(5)}</td>
                    <td className="p-1 text-right">{r.latency_ms}</td>
                    <td className={`p-1 ${r.success ? 'text-muted-foreground' : 'text-red-500'}`}>
                      {r.success ? '–' : (r.error_text?.slice(0, 24) || '!')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="text-sm text-muted-foreground mb-2">Controls</div>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Daily user budget ($)</div>
            <input 
              className="border rounded px-2 py-1 w-full bg-background" 
              defaultValue={cfg?.daily_user_budget_usd ?? 0.25} 
              onBlur={e => saveCfg({ daily_user_budget_usd: Number(e.target.value || 0) })}
            />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Daily global budget ($)</div>
            <input 
              className="border rounded px-2 py-1 w-full bg-background" 
              defaultValue={cfg?.daily_global_budget_usd ?? 10} 
              onBlur={e => saveCfg({ daily_global_budget_usd: Number(e.target.value || 0) })}
            />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Disable endpoints (comma-separated)</div>
            <input 
              className="border rounded px-2 py-1 w-full bg-background" 
              defaultValue={(cfg?.disable_endpoints || []).join(",")} 
              onBlur={e => saveCfg({ disable_endpoints: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
