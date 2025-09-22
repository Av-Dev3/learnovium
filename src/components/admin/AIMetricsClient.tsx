"use client";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  detailed_breakdown?: {
    embeddings: {
      calls: number;
      cost_usd: number;
      tokens: number;
      avg_cost_per_call: number;
    };
    chat_completions: {
      calls: number;
      cost_usd: number;
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
      avg_cost_per_call: number;
    };
  };
  endpoint_stats: Record<string, { 
    calls: number; 
    cost: number; 
    errors: number; 
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  }>;
  model_stats: Record<string, { 
    calls: number; 
    cost: number; 
    tokens: number; 
    prompt_tokens: number; 
    completion_tokens: number;
    total_tokens: number;
    success_rate: number;
  }>;
  filters: {
    endpoint?: string;
    success?: string;
    start_date?: string;
    end_date?: string;
  };
  timestamp: string;
  notes?: string[];
}

export default function AIMetricsClient() {
  const [metrics, setMetrics] = useState<AIMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    endpoint: 'all',
    success: 'all',
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
      
      if (filtersToApply.endpoint && filtersToApply.endpoint !== 'all') params.set('endpoint', filtersToApply.endpoint);
      if (filtersToApply.success && filtersToApply.success !== 'all') params.set('success', filtersToApply.success);
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
    const clearedFilters = { endpoint: 'all', success: 'all', start_date: '', end_date: '' };
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800 p-3 sm:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-gradient-purple">
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            AI Metrics Dashboard
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Comprehensive tracking of all AI API calls, costs, and performance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => loadMetrics(currentPage)} variant="outline" disabled={isLoading} className="w-full sm:w-auto">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={downloadCSV} variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">${(metrics.summary?.total_cost_usd || 0).toFixed(4)}</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              Last 24h: ${(metrics.summary?.recent_24h_cost || 0).toFixed(4)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Calls</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{(metrics.summary?.total_calls || 0).toLocaleString()}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Last 24h: {metrics.summary?.recent_24h_calls || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">{metrics.summary?.success_rate || 0}%</div>
            <p className="text-xs text-green-600 dark:text-green-400">
              {metrics.summary?.success_calls || 0} / {metrics.summary?.total_calls || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">Total Tokens</CardTitle>
            <Zap className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800 dark:text-amber-200">{metrics.summary.total_tokens.toLocaleString()}</div>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              {metrics.summary.total_prompt_tokens.toLocaleString()} input + {metrics.summary.total_completion_tokens.toLocaleString()} output
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Filter className="h-5 w-5 text-slate-600" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="endpoint" className="text-sm font-medium">Endpoint</Label>
              <Select value={filters.endpoint} onValueChange={(value) => handleFilterChange('endpoint', value)}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="All Endpoints" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Endpoints</SelectItem>
                  <SelectItem value="planner">Planner</SelectItem>
                  <SelectItem value="lesson">Lesson</SelectItem>
                  <SelectItem value="validator">Validator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="success" className="text-sm font-medium">Status</Label>
              <Select value={filters.success} onValueChange={(value) => handleFilterChange('success', value)}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Success</SelectItem>
                  <SelectItem value="false">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="start_date" className="text-sm font-medium">Start Date</Label>
              <Input
                id="start_date"
                type="datetime-local"
                className="mt-1"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end_date" className="text-sm font-medium">End Date</Label>
              <Input
                id="end_date"
                type="datetime-local"
                className="mt-1"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button onClick={applyFilters} size="sm" className="w-full sm:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button onClick={clearFilters} variant="outline" size="sm" className="w-full sm:w-auto">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      {metrics.detailed_breakdown && (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-indigo-800 dark:text-indigo-200">Detailed Breakdown</CardTitle>
            <CardDescription className="text-indigo-700 dark:text-indigo-300">
              Breakdown of embeddings and chat completions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Embeddings</h3>
                <p>Total Calls: {metrics.detailed_breakdown.embeddings?.calls || 0}</p>
                <p>Total Cost: ${(metrics.detailed_breakdown.embeddings?.cost_usd || 0).toFixed(4)}</p>
                <p>Total Tokens: {(metrics.detailed_breakdown.embeddings?.tokens || 0).toLocaleString()}</p>
                <p>Average Cost per Call: ${(metrics.detailed_breakdown.embeddings?.avg_cost_per_call || 0).toFixed(6)}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Chat Completions</h3>
                <p>Total Calls: {metrics.detailed_breakdown.chat_completions?.calls || 0}</p>
                <p>Total Cost: ${(metrics.detailed_breakdown.chat_completions?.cost_usd || 0).toFixed(4)}</p>
                <p>Total Tokens: {(metrics.detailed_breakdown.chat_completions?.total_tokens || 0).toLocaleString()}</p>
                <p>Average Cost per Call: ${(metrics.detailed_breakdown.chat_completions?.avg_cost_per_call || 0).toFixed(6)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Endpoint Stats */}
      <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-cyan-800 dark:text-cyan-200">Endpoint Performance</CardTitle>
          <CardDescription className="text-cyan-700 dark:text-cyan-300">AI calls grouped by endpoint</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(metrics.endpoint_stats || {}).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No endpoint data available yet</p>
              <p className="text-sm">Create a goal to generate some AI calls</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(metrics.endpoint_stats || {}).map(([endpoint, stats]) => (
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
                    <div className="font-medium">${(stats.cost || 0).toFixed(4)}</div>
                    <div className="text-sm text-muted-foreground">
                      {(stats.total_tokens || 0).toLocaleString()} tokens
                    </div>
                    {stats.errors > 0 && (
                      <div className="text-sm text-red-600">{stats.errors} errors</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Stats */}
      <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-pink-800 dark:text-pink-200">Model Usage</CardTitle>
          <CardDescription className="text-pink-700 dark:text-pink-300">AI calls grouped by model</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(metrics.model_stats || {}).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No model data available yet</p>
              <p className="text-sm">Create a goal to generate some AI calls</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(metrics.model_stats || {}).map(([model, stats]) => (
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
                    {(stats.total_tokens || 0).toLocaleString()} total tokens
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(stats.prompt_tokens || 0).toLocaleString()} input + {(stats.completion_tokens || 0).toLocaleString()} output
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Calls Table */}
      <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-violet-800 dark:text-violet-200">Recent AI Calls</CardTitle>
          <CardDescription className="text-violet-700 dark:text-violet-300">
            Detailed log of AI API calls with token usage and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, metrics.pagination?.total || 0)} of {metrics.pagination?.total || 0} calls
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
          {(!metrics.calls || metrics.calls.length === 0) ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No AI calls logged yet</p>
              <p className="text-sm">Create a goal to generate some AI calls</p>
            </div>
          ) : (
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
          )}

          {/* Bottom Pagination */}
          {metrics.pagination && metrics.pagination.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className="w-full sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm font-medium px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="w-full sm:w-auto"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes Section */}
      {metrics.notes && metrics.notes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Important Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              {metrics.notes.map((note, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-muted-foreground text-center">
        Last updated: {metrics.timestamp ? new Date(metrics.timestamp).toLocaleString() : 'Never'}
      </div>
    </div>
  );
}
