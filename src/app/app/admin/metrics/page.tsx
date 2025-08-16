"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Users, 
  Clock, 
  DollarSign, 
  RefreshCw,
  Shield
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

interface TopUser {
  user_id: string;
  email: string;
  is_admin: boolean;
  call_count: number;
  total_cost_usd: number;
  success_calls: number;
  error_calls: number;
  success_rate: string;
}

export default function AdminMetricsPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryRes, usersRes] = await Promise.all([
        fetch("/api/admin/metrics/summary"),
        fetch("/api/admin/metrics/top-users")
      ]);

      if (summaryRes.ok && usersRes.ok) {
        const [summaryData, usersData] = await Promise.all([
          summaryRes.json(),
          usersRes.json()
        ]);
        
        setSummary(summaryData);
        setTopUsers(usersData.users || []);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        <Button onClick={fetchData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

      {/* Top Users */}
      <Card>
        <CardHeader>
          <CardTitle>Top Users Today</CardTitle>
          <CardDescription>Users ranked by AI usage cost</CardDescription>
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
    </div>
  );
}
