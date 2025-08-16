"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Users, 
  Clock, 
  DollarSign, 
  RefreshCw,
  Shield,
  Settings,
  FileText,
  Download,
  CheckCircle,
  XCircle
} from "lucide-react";

interface SummaryData {
  summary: {
    day: string;
    total_calls: number;
    success_calls: number;
    error_calls: number;
    total_cost_usd: number;
    avg_latency_ms: number;
  };
  config: {
    daily_user_budget_usd: number;
    daily_global_budget_usd: number;
    disable_endpoints: string[];
  };
  endpoints: Array<{
    endpoint: string;
    total_calls: number;
    success_calls: number;
    error_calls: number;
    total_cost_usd: number;
    avg_latency_ms: number;
  }>;
}

interface TopUser extends Record<string, unknown> {
  user_id: string;
  email: string;
  is_admin: boolean;
  call_count: number;
  total_cost_usd: number;
  success_calls: number;
  error_calls: number;
  success_rate: string;
}

interface LogEntry extends Record<string, unknown> {
  id: string;
  created_at: string;
  user_id: string;
  goal_id?: string;
  endpoint: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost_usd: number;
  latency_ms: number;
  success: boolean;
  error_text?: string;
}

interface AdminConfig {
  daily_user_budget_usd: number;
  daily_global_budget_usd: number;
  disable_endpoints: string[];
}

export default function AdminMetricsPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryRes, usersRes, logsRes, configRes] = await Promise.all([
        fetch("/api/admin/metrics/summary"),
        fetch("/api/admin/metrics/top-users"),
        fetch("/api/admin/metrics/logs?limit=100"),
        fetch("/api/admin/toggles")
      ]);

      if (summaryRes.ok && usersRes.ok && logsRes.ok && configRes.ok) {
        const [summaryData, usersData, logsData, configData] = await Promise.all([
          summaryRes.json(),
          usersRes.json(),
          logsRes.json(),
          configRes.json()
        ]);
        
        setSummary(summaryData);
        setTopUsers(usersData.users || []);
        setLogs(logsData.logs || []);
        setConfig(configData);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = async (newConfig: Partial<AdminConfig>) => {
    try {
      setSaving(true);
      const response = await fetch("/api/admin/toggles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig),
      });

      if (response.ok) {
        await fetchData(); // Refresh data
      } else {
        throw new Error("Failed to update configuration");
      }
    } catch (err) {
      setError("Failed to update configuration");
      console.error("Error updating config:", err);
    } finally {
      setSaving(false);
    }
  };

  const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error: {error}</div>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Admin Mission Control
          </h1>
          <p className="text-gray-600 mt-2">Monitor AI usage, budgets, and system health</p>
        </div>
        <Button onClick={fetchData} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="users">Top Users</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Calls Today</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary?.summary.total_calls || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {summary?.summary.success_calls || 0} successful, {summary?.summary.error_calls || 0} failed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost Today</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(summary?.summary.total_cost_usd || 0).toFixed(6)}</div>
                <p className="text-xs text-muted-foreground">
                  Avg: ${summary?.summary.total_calls ? (summary.summary.total_cost_usd / summary.summary.total_calls).toFixed(6) : "0.00"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary?.summary.total_calls ? Math.round((summary.summary.success_calls / summary.summary.total_calls) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary?.summary.success_calls || 0} / {summary?.summary.total_calls || 0} calls
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(summary?.summary.avg_latency_ms || 0)}ms</div>
                <p className="text-xs text-muted-foreground">
                  Response time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Endpoint Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Endpoint Performance</CardTitle>
              <CardDescription>Breakdown by AI endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary?.endpoints.map((endpoint) => (
                  <div key={endpoint.endpoint} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="capitalize">
                        {endpoint.endpoint}
                      </Badge>
                      <div className="text-sm text-gray-500">
                        {endpoint.total_calls} calls • {endpoint.success_calls} success • {endpoint.error_calls} errors
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${endpoint.total_cost_usd.toFixed(6)}</div>
                      <div className="text-sm text-gray-500">
                        {Math.round(endpoint.avg_latency_ms)}ms avg
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>Manage budgets and endpoint access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Budget Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Budget Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-budget">Daily User Budget (USD)</Label>
                    <Input
                      id="user-budget"
                      type="number"
                      step="0.000001"
                      value={config?.daily_user_budget_usd || 0}
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        daily_user_budget_usd: parseFloat(e.target.value) || 0
                      } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="global-budget">Daily Global Budget (USD)</Label>
                    <Input
                      id="global-budget"
                      type="number"
                      step="0.000001"
                      value={config?.daily_global_budget_usd || 0}
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        daily_global_budget_usd: parseFloat(e.target.value) || 0
                      } : null)}
                    />
                  </div>
                </div>
              </div>

              {/* Endpoint Toggles */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Endpoint Access</h3>
                <div className="space-y-3">
                  {["planner", "lesson", "validator"].map((endpoint) => (
                    <div key={endpoint} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">
                          {endpoint}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {endpoint === "planner" && "AI goal planning"}
                          {endpoint === "lesson" && "AI lesson generation"}
                          {endpoint === "validator" && "AI content validation"}
                        </span>
                      </div>
                      <Switch
                        checked={!config?.disable_endpoints.includes(endpoint)}
                        onCheckedChange={(enabled) => {
                          const newDisabled = enabled 
                            ? config?.disable_endpoints.filter(e => e !== endpoint) || []
                            : [...(config?.disable_endpoints || []), endpoint];
                          setConfig(prev => prev ? { ...prev, disable_endpoints: newDisabled } : null);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <Button 
                  onClick={() => config && updateConfig(config)}
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? "Saving..." : "Save Configuration"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent AI Call Logs
                  </CardTitle>
                  <CardDescription>Monitor AI usage and performance</CardDescription>
                </div>
                <Button 
                  onClick={() => exportToCSV(logs, `ai-logs-${new Date().toISOString().split('T')[0]}.csv`)}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {log.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Badge variant="outline" className="capitalize">
                          {log.endpoint}
                        </Badge>
                        <Badge variant="secondary">
                          {log.model}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">${log.cost_usd.toFixed(6)}</div>
                      <div className="text-gray-500">
                        {log.total_tokens} tokens • {log.latency_ms}ms
                      </div>
                      {log.error_text && (
                        <div className="text-red-500 text-xs mt-1 max-w-xs truncate">
                          {log.error_text}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No logs available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Top Users Today</CardTitle>
                  <CardDescription>Users ranked by AI usage cost</CardDescription>
                </div>
                <Button 
                  onClick={() => exportToCSV(topUsers, `top-users-${new Date().toISOString().split('T')[0]}.csv`)}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topUsers.map((user, index) => (
                  <div key={user.user_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{user.email}</div>
                        <div className="text-sm text-gray-500">
                          {user.call_count} calls • {user.success_rate}% success
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${user.total_cost_usd.toFixed(6)}</div>
                      <div className="text-sm text-gray-500">
                        {user.is_admin && <Badge variant="secondary">Admin</Badge>}
                      </div>
                    </div>
                  </div>
                ))}
                {topUsers.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No user data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
