"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from "recharts";
import { 
  DollarSign, Users, Activity, Settings, Save, RefreshCw, Download, 
  AlertTriangle, CheckCircle, Database, Target
} from "lucide-react";

interface SummaryData {
  total_cost_usd: number;
  success_calls: number;
  error_calls: number;
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

interface PlanMetrics {
  total_goals: number;
  total_templates: number;
  reused_plans: number;
  new_plans_generated: number;
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
  const [endpoints, setEndpoints] = useState<EndpointData[]>([]);
  const [top, setTop] = useState<TopUserData[]>([]);
  const [logs, setLogs] = useState<LogData[]>([]);
  const [planMetrics, setPlanMetrics] = useState<PlanMetrics | null>(null);
  const [endpointFilter, setEndpointFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form state for config changes
  const [configForm, setConfigForm] = useState({
    daily_user_budget_usd: 0.25,
    daily_global_budget_usd: 10,
    disable_endpoints: ""
  });

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      // views/tables are protected by RLS: only is_admin can read
      const [{ data: s }, { data: acfg }, { data: pm }] = await Promise.all([
        sb.from("v_ai_spend_summary").select("*").maybeSingle(),
        sb.from("admin_config").select("daily_user_budget_usd,daily_global_budget_usd,disable_endpoints").eq("id", 1).single(),
        sb.from("plan_template").select("id").then((res: { data: { id: string }[] | null }) => ({ data: res.data?.length || 0 }))
      ]);
      
      setSummary(s || null);
      
      // Load plan metrics
      const [{ data: totalGoals }, { data: reusedPlans }, { data: newPlans }] = await Promise.all([
        sb.from("learning_goals").select("id", { count: "exact" }),
        sb.from("learning_goals").select("id").not("plan_template_id", "is", null),
        sb.from("learning_goals").select("id").is("plan_template_id", null)
      ]);
      
      setPlanMetrics({
        total_goals: totalGoals?.length || 0,
        total_templates: pm || 0,
        reused_plans: reusedPlans?.length || 0,
        new_plans_generated: newPlans?.length || 0
      });

      // Update form state
      if (acfg) {
        setConfigForm({
          daily_user_budget_usd: acfg.daily_user_budget_usd || 0.25,
          daily_global_budget_usd: acfg.daily_global_budget_usd || 10,
          disable_endpoints: (acfg.disable_endpoints || []).join(", ")
        });
      }

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
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sb, endpointFilter]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const chartData = useMemo(() => {
    if (!logs?.length) return [];
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

  async function saveConfig() {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      const patch = {
        daily_user_budget_usd: Number(configForm.daily_user_budget_usd),
        daily_global_budget_usd: Number(configForm.daily_global_budget_usd),
        disable_endpoints: configForm.disable_endpoints.split(",").map(s => s.trim()).filter(Boolean)
      };

      // Direct update to admin_config (RLS allows admin update)
      await sb.from("admin_config").update(patch).eq("id", 1);
      
      // Invalidate cache so changes take effect immediately
      await fetch("/api/admin/config/invalidate", { method: "POST" });
      
      setSaveMessage({ type: 'success', text: 'Configuration saved successfully!' });
      await loadAll();
    } catch (error) {
      console.error("Error saving config:", error);
      setSaveMessage({ type: 'error', text: 'Failed to save configuration' });
    } finally {
      setIsSaving(false);
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Monitor AI usage, budgets, and system performance</p>
        </div>
        <div className="flex gap-3">
          <select 
            className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            value={endpointFilter} 
            onChange={e => setEndpointFilter(e.target.value)}
          >
            <option value="">All endpoints</option>
            <option value="planner">planner</option>
            <option value="lesson">lesson</option>
            <option value="validator">validator</option>
          </select>
          <Button 
            variant="outline" 
            onClick={loadAll} 
            disabled={isLoading}
            className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-500" />
              Today&apos;s Global Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              ${Number(summary?.total_cost_usd || 0).toFixed(4)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Across all users and endpoints
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
              Successful Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {summary?.success_calls ?? 0}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              AI requests completed successfully
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              Error Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {summary?.error_calls ?? 0}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Failed AI requests
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center">
              <Database className="h-4 w-4 mr-2 text-purple-500" />
              Plan Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {planMetrics?.total_templates ?? 0}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Cached for reuse
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plan Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-500" />
              Learning Plans Overview
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Plan creation and reuse statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {planMetrics?.total_goals ?? 0}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Total Goals</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {planMetrics?.reused_plans ?? 0}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">Reused Plans</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {planMetrics?.total_templates ?? 0}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Templates Stored</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {planMetrics?.new_plans_generated ?? 0}
                </div>
                <div className="text-sm text-orange-600 dark:text-orange-400">New Plans</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-500" />
              Endpoint Performance
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Today&apos;s usage by endpoint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={endpoints}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ endpoint, spend }) => `${endpoint}: $${spend.toFixed(4)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="spend"
                >
                  {endpoints.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`$${value.toFixed(4)}`, 'Spend']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Live Spend & Errors</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Per-minute breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="ts" 
                  tickFormatter={(v) => new Date(v).toLocaleTimeString()}
                  stroke="#64748b"
                />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  labelFormatter={(v) => new Date(v as string).toLocaleTimeString()}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cost" 
                  name="Cost ($)" 
                  dot={false} 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="errors" 
                  name="Errors" 
                  dot={false} 
                  stroke="#ef4444" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Endpoint Breakdown</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Today&apos;s usage by endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={endpoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="endpoint" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'spend' ? `$${value.toFixed(4)}` : value,
                    name === 'spend' ? 'Spend ($)' : 'Calls'
                  ]}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="spend" name="Spend ($)" fill="#3b82f6" />
                <Bar dataKey="calls" name="Calls" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Section */}
      <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-amber-500" />
            System Configuration
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Manage budgets and endpoint availability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="user-budget" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Daily User Budget ($)
              </Label>
              <Input
                id="user-budget"
                type="number"
                step="0.01"
                min="0"
                value={configForm.daily_user_budget_usd}
                onChange={(e) => setConfigForm(prev => ({ 
                  ...prev, 
                  daily_user_budget_usd: Number(e.target.value) || 0 
                }))}
                className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                placeholder="0.25"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Maximum daily spend per user
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="global-budget" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Daily Global Budget ($)
              </Label>
              <Input
                id="global-budget"
                type="number"
                step="0.01"
                min="0"
                value={configForm.daily_global_budget_usd}
                onChange={(e) => setConfigForm(prev => ({ 
                  ...prev, 
                  daily_global_budget_usd: Number(e.target.value) || 0 
                }))}
                className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                placeholder="10.00"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Maximum daily spend across all users
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="disabled-endpoints" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Disabled Endpoints
              </Label>
              <Input
                id="disabled-endpoints"
                value={configForm.disable_endpoints}
                onChange={(e) => setConfigForm(prev => ({ 
                  ...prev, 
                  disable_endpoints: e.target.value 
                }))}
                className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                placeholder="planner, lesson"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comma-separated list of endpoints to disable
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={saveConfig} 
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </Button>
              
              {saveMessage && (
                <Badge 
                  variant={saveMessage.type === 'success' ? 'default' : 'destructive'}
                  className="ml-2"
                >
                  {saveMessage.text}
                </Badge>
              )}
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400">
              Changes take effect within 5 seconds
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Users Today</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Highest spenders in the last 24 hours
                </CardDescription>
              </div>
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
                className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(top || []).map((r: TopUserData, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {i + 1}
                      </span>
                    </div>
                    <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {r.user_id.slice(0, 8)}...
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    ${Number(r.total_cost_usd || 0).toFixed(4)}
                  </div>
                </div>
              ))}
              {(!top || top.length === 0) && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No user data available yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Activity Logs</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Latest AI call attempts and results
                </CardDescription>
              </div>
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
                className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-auto">
              <table className="w-full">
                <thead className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left p-2 font-medium">Time</th>
                    <th className="text-left p-2 font-medium">Endpoint</th>
                    <th className="text-left p-2 font-medium">Model</th>
                    <th className="text-right p-2 font-medium">Tokens</th>
                    <th className="text-right p-2 font-medium">Cost</th>
                    <th className="text-right p-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {logs.slice(0, 20).map((r: LogData, i: number) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                      <td className="p-2 text-slate-600 dark:text-slate-400">
                        {new Date(r.created_at).toLocaleTimeString()}
                      </td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-xs">
                          {r.endpoint}
                        </Badge>
                      </td>
                      <td className="p-2 text-slate-600 dark:text-slate-400 font-mono text-xs">
                        {r.model}
                      </td>
                      <td className="p-2 text-right text-slate-600 dark:text-slate-400">
                        {r.total_tokens}
                      </td>
                      <td className="p-2 text-right font-medium">
                        ${Number(r.cost_usd || 0).toFixed(5)}
                      </td>
                      <td className="p-2 text-right">
                        <Badge 
                          variant={r.success ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {r.success ? "✓" : "✗"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!logs || logs.length === 0) && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No activity logs available yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
