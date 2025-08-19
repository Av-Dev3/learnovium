"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign, Activity, AlertTriangle, CheckCircle, 
  RefreshCw, Download, Clock, Database, Target
} from "lucide-react";

interface AICall {
  id: string;
  created_at: string;
  user_id: string;
  endpoint: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  cost_usd: number;
  success: boolean;
  latency_ms: number;
  error_text?: string;
}

interface AIMetrics {
  summary: {
    total_cost_usd: number;
    total_calls: number;
    success_calls: number;
    error_calls: number;
    recent_24h_calls: number;
    recent_24h_cost: number;
  };
  endpoint_stats: Record<string, { calls: number; cost: number; errors: number }>;
  model_stats: Record<string, { calls: number; cost: number; tokens: number }>;
  recent_calls: AICall[];
  timestamp: string;
}

export default function AIMetricsClient() {
  const [metrics, setMetrics] = useState<AIMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/metrics/ai');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
      console.error('Error loading AI metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const downloadCSV = () => {
    if (!metrics?.recent_calls) return;
    
    const headers = ['Date', 'Endpoint', 'Model', 'Tokens', 'Cost (USD)', 'Success', 'Latency (ms)', 'Error'];
    const csvContent = [
      headers.join(','),
      ...metrics.recent_calls.map(call => [
        new Date(call.created_at).toLocaleString(),
        call.endpoint,
        call.model,
        call.prompt_tokens + call.completion_tokens,
        call.cost_usd?.toFixed(6) || '0',
        call.success ? 'Yes' : 'No',
        call.latency_ms || '0',
        call.error_text || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-metrics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading AI metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Error Loading Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadMetrics}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p>No metrics data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Metrics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive tracking of all AI API calls, costs, and performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadMetrics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={downloadCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.summary.total_cost_usd.toFixed(4)}</div>
            <p className="text-xs text-muted-foreground">
              Last 24h: ${metrics.summary.recent_24h_cost.toFixed(4)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.summary.total_calls}</div>
            <p className="text-xs text-muted-foreground">
              Last 24h: {metrics.summary.recent_24h_calls}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.summary.total_calls > 0 
                ? Math.round((metrics.summary.success_calls / metrics.summary.total_calls) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.summary.success_calls} / {metrics.summary.total_calls}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.summary.error_calls}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.summary.total_calls > 0 
                ? Math.round((metrics.summary.error_calls / metrics.summary.total_calls) * 100)
                : 0}% rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Endpoint Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Endpoint Performance</CardTitle>
          <CardDescription>AI calls grouped by endpoint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(metrics.endpoint_stats).map(([endpoint, stats]) => (
              <div key={endpoint} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={stats.errors > 0 ? "destructive" : "default"}>
                    {endpoint}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {stats.calls} calls
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-medium">${stats.cost.toFixed(4)}</div>
                  {stats.errors > 0 && (
                    <div className="text-sm text-red-600">{stats.errors} errors</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Model Usage</CardTitle>
          <CardDescription>AI calls grouped by model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(metrics.model_stats).map(([model, stats]) => (
              <div key={model} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{model}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {stats.calls} calls
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-medium">${stats.cost.toFixed(4)}</div>
                  <div className="text-sm text-muted-foreground">
                    {stats.tokens.toLocaleString()} tokens
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Calls */}
      <Card>
        <CardHeader>
          <CardTitle>Recent AI Calls</CardTitle>
          <CardDescription>Last 50 AI API calls with detailed information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recent_calls.map((call) => (
              <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={call.success ? "default" : "destructive"}>
                    {call.success ? "✓" : "✗"}
                  </Badge>
                  <div>
                    <div className="font-medium">{call.endpoint}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(call.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{call.model}</div>
                  <div className="text-sm text-muted-foreground">
                    ${call.cost_usd?.toFixed(6) || '0'} • {call.latency_ms || 0}ms
                  </div>
                  {call.error_text && (
                    <div className="text-xs text-red-600 max-w-xs truncate">
                      {call.error_text}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground text-center">
        Last updated: {new Date(metrics.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
