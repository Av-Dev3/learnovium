"use client";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  DollarSign, Activity, AlertTriangle, CheckCircle, 
  RefreshCw, Download, Filter,
  ChevronLeft, ChevronRight, Search, Zap, Brain
} from "lucide-react";

interface AICall {
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
  success: boolean;
  latency_ms: number;
  error_text?: string;
  profiles?: { email: string };
}

interface AIMetrics {
  calls: AICall[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
  summary: {
    total_cost_usd: number;
    total_calls: number;
    success_calls: number;
    error_calls: number;
    success_rate: number;
    total_tokens: number;
    total_prompt_tokens: number;
    total_completion_tokens: number;
    avg_cost_per_call: number;
    recent_24h_calls: number;
    recent_24h_cost: number;
  };
  endpoint_stats: Record<string, { calls: number; cost: number; errors: number; tokens: number }>;
  model_stats: Record<string, { calls: number; cost: number; tokens: number; prompt_tokens: number; completion_tokens: number }>;
  filters: {
    endpoint?: string;
    success?: string;
    start_date?: string;
    end_date?: string;
  };
  timestamp: string;
}

export default function AIMetricsClient() {
  const [metrics, setMetrics] = useState<AIMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    endpoint: '',
    success: '',
    start_date: '',
    end_date: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  const loadMetrics = useCallback(async (page = 1, filtersToApply = filters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.set('limit', pageSize.toString());
      params.set('offset', ((page - 1) * pageSize).toString());
      
      if (filtersToApply.endpoint) params.set('endpoint', filtersToApply.endpoint);
      if (filtersToApply.success) params.set('success', filtersToApply.success);
      if (filtersToApply.start_date) params.set('start_date', filtersToApply.start_date);
      if (filtersToApply.end_date) params.set('end_date', filtersToApply.end_date);

      const response = await fetch(`/api/admin/ai-metrics?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMetrics(data);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
      console.error('Error loading AI metrics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pageSize]);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    loadMetrics(1, filters);
  };

  const clearFilters = () => {
    const clearedFilters = { endpoint: '', success: '', start_date: '', end_date: '' };
    setFilters(clearedFilters);
    setCurrentPage(1);
    loadMetrics(1, clearedFilters);
  };

  const downloadCSV = () => {
    if (!metrics?.calls) return;
    
    const headers = ['Date', 'User Email', 'Endpoint', 'Model', 'Prompt Tokens', 'Completion Tokens', 'Total Tokens', 'Cost (USD)', 'Success', 'Latency (ms)', 'Error'];
    const csvContent = [
      headers.join(','),
      ...metrics.calls.map(call => [
        new Date(call.created_at).toISOString(),
        call.profiles?.email || call.user_id,
        call.endpoint,
        call.model,
        call.prompt_tokens,
        call.completion_tokens,
        call.total_tokens,
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

  const goToPage = (page: number) => {
    loadMetrics(page);
  };

  const totalPages = metrics ? Math.ceil(metrics.pagination.total / pageSize) : 0;

  if (isLoading && !metrics) {
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
            <Button onClick={() => loadMetrics()}>Retry</Button>
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
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            AI Metrics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive tracking of all AI API calls, costs, and performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => loadMetrics(currentPage)} variant="outline" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
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
            <div className="text-2xl font-bold">{metrics.summary.total_calls.toLocaleString()}</div>
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
            <div className="text-2xl font-bold">{metrics.summary.success_rate}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.summary.success_calls} / {metrics.summary.total_calls}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.summary.total_tokens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.summary.total_prompt_tokens.toLocaleString()} input + {metrics.summary.total_completion_tokens.toLocaleString()} output
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="endpoint">Endpoint</Label>
              <select 
                id="endpoint"
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.endpoint}
                onChange={(e) => handleFilterChange('endpoint', e.target.value)}
              >
                <option value="">All Endpoints</option>
                <option value="planner">Planner</option>
                <option value="lesson">Lesson</option>
                <option value="validator">Validator</option>
              </select>
            </div>
            <div>
              <Label htmlFor="success">Status</Label>
              <select 
                id="success"
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.success}
                onChange={(e) => handleFilterChange('success', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="true">Success</option>
                <option value="false">Error</option>
              </select>
            </div>
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={applyFilters} size="sm">
              <Search className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button onClick={clearFilters} variant="outline" size="sm">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Endpoint Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Endpoint Performance</CardTitle>
          <CardDescription>AI calls grouped by endpoint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(metrics.endpoint_stats).map(([endpoint, stats]) => (
              <div key={endpoint} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant={stats.errors > 0 ? "destructive" : "default"}>
                    {endpoint}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {stats.calls} calls
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-medium">${stats.cost.toFixed(4)}</div>
                  <div className="text-sm text-muted-foreground">
                    {stats.tokens.toLocaleString()} tokens
                  </div>
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
              <div key={model} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{model}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {stats.calls} calls
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-medium">${stats.cost.toFixed(4)}</div>
                  <div className="text-sm text-muted-foreground">
                    {stats.tokens.toLocaleString()} total tokens
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stats.prompt_tokens.toLocaleString()} input + {stats.completion_tokens.toLocaleString()} output
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Calls Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent AI Calls</CardTitle>
          <CardDescription>
            Detailed log of AI API calls with token usage and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, metrics.pagination.total)} of {metrics.pagination.total} calls
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calls Table */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {metrics.calls.map((call) => (
              <div key={call.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={call.success ? "default" : "destructive"}>
                      {call.success ? "✓" : "✗"}
                    </Badge>
                    <Badge variant="outline">{call.endpoint}</Badge>
                    <Badge variant="secondary">{call.model}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(call.created_at).toLocaleString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">User</div>
                    <div className="text-muted-foreground truncate">
                      {call.profiles?.email || call.user_id.substring(0, 8) + "..."}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Tokens</div>
                    <div className="text-muted-foreground">
                      {call.prompt_tokens} → {call.completion_tokens} ({call.total_tokens})
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Cost</div>
                    <div className="text-muted-foreground">
                      ${call.cost_usd?.toFixed(6) || '0'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Latency</div>
                    <div className="text-muted-foreground">
                      {call.latency_ms || 0}ms
                    </div>
                  </div>
                </div>
                
                {call.error_text && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                    <div className="font-medium text-red-800">Error:</div>
                    <div className="text-red-700">{call.error_text}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Pagination */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground text-center">
        Last updated: {new Date(metrics.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
