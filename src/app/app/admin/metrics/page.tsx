"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  // LineChart,
  // Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  // PieChart,
  // Pie,
  // Cell,
} from "recharts";
import {
  Download,
  RefreshCw,
  DollarSign,
  CheckCircle,
  XCircle,
  // Users,
  Activity,
  // AlertTriangle,
  Settings,
  // Database,
} from "lucide-react";
import { downloadCSV, formatForCSV, csvTransformers } from "@/lib/csv";

interface MetricsSummary {
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
  budget_status: {
    global_spent: number;
    global_limit: number;
    global_remaining: number;
    global_percent_used: number;
  };
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

const COLORS = {
  planner: "#8884d8",
  lesson: "#82ca9d",
  validator: "#ffc658",
  success: "#22c55e",
  error: "#ef4444",
};

export default function AdminMetricsPage() {
  const [summary, setSummary] = useState<MetricsSummary | null>(null);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Configuration state
  const [userBudget, setUserBudget] = useState(0.25);
  const [globalBudget, setGlobalBudget] = useState(10);
  const [disabledEndpoints, setDisabledEndpoints] = useState<string[]>([]);
  
  // Filters
  const [logEndpointFilter, setLogEndpointFilter] = useState<string>("");
  // const [logLimit, setLogLimit] = useState(100);

  const fetchData = useCallback(async () => {
    try {
      const [summaryRes, usersRes, logsRes] = await Promise.all([
        fetch("/api/admin/metrics/summary"),
        fetch("/api/admin/metrics/top-users"),
        fetch(`/api/admin/metrics/logs?limit=100${logEndpointFilter ? `&endpoint=${logEndpointFilter}` : ""}`),
      ]);

      if (!summaryRes.ok || !usersRes.ok || !logsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [summaryData, usersData, logsData] = await Promise.all([
        summaryRes.json(),
        usersRes.json(),
        logsRes.json(),
      ]);

      setSummary(summaryData);
      setTopUsers(usersData.users || []);
      setLogs(logsData.logs || []);
      
      // Update form state with current config
      setUserBudget(summaryData.config.daily_user_budget_usd);
      setGlobalBudget(summaryData.config.daily_global_budget_usd);
      setDisabledEndpoints(summaryData.config.disable_endpoints);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch metrics data");
    } finally {
      setLoading(false);
    }
  }, [logEndpointFilter]);

  const saveConfiguration = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/toggles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          daily_user_budget_usd: userBudget,
          daily_global_budget_usd: globalBudget,
          disable_endpoints: disabledEndpoints,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save configuration");
      }

      toast.success("Configuration saved successfully");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  const toggleEndpoint = (endpoint: string) => {
    setDisabledEndpoints(prev => 
      prev.includes(endpoint)
        ? prev.filter(ep => ep !== endpoint)
        : [...prev, endpoint]
    );
  };

  const exportTopUsers = () => {
    const formatted = formatForCSV(topUsers, {
      total_cost_usd: csvTransformers.currency(6),
      is_admin: csvTransformers.boolean,
    });
    downloadCSV(formatted, `top-users-${new Date().toISOString().split('T')[0]}`);
  };

  const exportLogs = () => {
    const formatted = formatForCSV(logs, {
      created_at: csvTransformers.date,
      cost_usd: csvTransformers.currency(6),
      success: csvTransformers.boolean,
      error_text: csvTransformers.truncate(200),
    });
    downloadCSV(formatted, `ai-call-logs-${new Date().toISOString().split('T')[0]}`);
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [logEndpointFilter, fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading metrics...</span>
        </div>
      </div>
    );
  }

  const successRate = summary?.summary?.total_calls && summary.summary.total_calls > 0 
    ? (summary.summary.success_calls / summary.summary.total_calls * 100).toFixed(1)
    : "0.0";

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Mission Control</h1>
          <p className="text-muted-foreground">Monitor AI usage, costs, and system health</p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Global Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summary?.budget_status.global_spent.toFixed(4) || "0.0000"}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.budget_status.global_percent_used.toFixed(1)}% of ${summary?.budget_status.global_limit.toFixed(2)} limit
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  (summary?.budget_status.global_percent_used || 0) > 80 ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, summary?.budget_status.global_percent_used || 0)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Calls</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.summary.success_calls || 0}</div>
            <p className="text-xs text-muted-foreground">
              {successRate}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Calls</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.summary.error_calls || 0}</div>
            <p className="text-xs text-muted-foreground">
              {summary?.summary.total_calls || 0} total calls today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(summary?.summary.avg_latency_ms || 0)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Response time
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Top Users</TabsTrigger>
          <TabsTrigger value="logs">Recent Logs</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Endpoint Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Spend by Endpoint (Today)</CardTitle>
                <CardDescription>Cost distribution across AI endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={summary?.endpoints || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="endpoint" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === "total_cost_usd" ? `$${Number(value).toFixed(6)}` : value,
                        name === "total_cost_usd" ? "Cost" : name
                      ]}
                    />
                    <Bar dataKey="total_cost_usd" fill={COLORS.planner} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Success/Error Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Call Success Rate by Endpoint</CardTitle>
                <CardDescription>Success vs error calls today</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={summary?.endpoints || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="endpoint" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="success_calls" fill={COLORS.success} name="Success" />
                    <Bar dataKey="error_calls" fill={COLORS.error} name="Errors" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Endpoint Status */}
          <Card>
            <CardHeader>
              <CardTitle>Endpoint Status</CardTitle>
              <CardDescription>Current status of AI endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["planner", "lesson", "validator"].map(endpoint => {
                  const isDisabled = disabledEndpoints.includes(endpoint);
                  const endpointData = summary?.endpoints.find(ep => ep.endpoint === endpoint);
                  
                  return (
                    <div key={endpoint} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium capitalize">{endpoint}</h3>
                        <Badge variant={isDisabled ? "destructive" : "default"}>
                          {isDisabled ? "Disabled" : "Active"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>Calls: {endpointData?.total_calls || 0}</div>
                        <div>Cost: ${(endpointData?.total_cost_usd || 0).toFixed(6)}</div>
                        <div>Latency: {Math.round(endpointData?.avg_latency_ms || 0)}ms</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Users Today</CardTitle>
                <CardDescription>Users with highest AI usage and costs</CardDescription>
              </div>
              <Button onClick={exportTopUsers} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Calls</th>
                      <th className="text-left p-2">Cost</th>
                      <th className="text-left p-2">Success Rate</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topUsers.map(user => (
                      <tr key={user.user_id} className="border-b">
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            <span>{user.email}</span>
                            {user.is_admin && (
                              <Badge variant="secondary" className="text-xs">Admin</Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-2">{user.call_count}</td>
                        <td className="p-2">${user.total_cost_usd.toFixed(6)}</td>
                        <td className="p-2">{user.success_rate}%</td>
                        <td className="p-2">
                          <div className="flex items-center space-x-1">
                            <span className="text-green-500">{user.success_calls}</span>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-red-500">{user.error_calls}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent AI Call Logs</CardTitle>
                <CardDescription>Detailed log of all AI API calls</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <select 
                  value={logEndpointFilter} 
                  onChange={(e) => setLogEndpointFilter(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="">All Endpoints</option>
                  <option value="planner">Planner</option>
                  <option value="lesson">Lesson</option>
                  <option value="validator">Validator</option>
                </select>
                <Button onClick={exportLogs} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b">
                      <th className="text-left p-2">Time</th>
                      <th className="text-left p-2">Endpoint</th>
                      <th className="text-left p-2">Model</th>
                      <th className="text-left p-2">Tokens</th>
                      <th className="text-left p-2">Cost</th>
                      <th className="text-left p-2">Latency</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="text-xs">
                            {log.endpoint}
                          </Badge>
                        </td>
                        <td className="p-2">{log.model}</td>
                        <td className="p-2">{log.total_tokens}</td>
                        <td className="p-2">${log.cost_usd.toFixed(6)}</td>
                        <td className="p-2">{log.latency_ms}ms</td>
                        <td className="p-2">
                          {log.success ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="flex items-center space-x-1">
                              <XCircle className="h-4 w-4 text-red-500" />
                              {log.error_text && (
                                <span className="text-xs text-red-500 truncate max-w-20" title={log.error_text}>
                                  {log.error_text}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Budget Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Limits</CardTitle>
                <CardDescription>Configure daily spending limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-budget">Daily User Budget (USD)</Label>
                  <Input
                    id="user-budget"
                    type="number"
                    step="0.01"
                    min="0"
                    value={userBudget}
                    onChange={(e) => setUserBudget(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum daily spend per user
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="global-budget">Daily Global Budget (USD)</Label>
                  <Input
                    id="global-budget"
                    type="number"
                    step="0.01"
                    min="0"
                    value={globalBudget}
                    onChange={(e) => setGlobalBudget(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum total daily spend across all users
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Endpoint Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Endpoint Controls</CardTitle>
                <CardDescription>Enable or disable AI endpoints</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {["planner", "lesson", "validator"].map(endpoint => (
                  <div key={endpoint} className="flex items-center justify-between">
                    <div>
                      <Label className="capitalize">{endpoint}</Label>
                      <p className="text-xs text-muted-foreground">
                        {endpoint === "planner" && "Learning plan generation"}
                        {endpoint === "lesson" && "Daily lesson creation"}
                        {endpoint === "validator" && "Content validation"}
                      </p>
                    </div>
                    <Switch
                      checked={!disabledEndpoints.includes(endpoint)}
                      onCheckedChange={() => toggleEndpoint(endpoint)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Save Configuration</CardTitle>
              <CardDescription>Apply changes to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={saveConfiguration} disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    Save Configuration
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
