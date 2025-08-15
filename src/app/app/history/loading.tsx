import { LoadingState } from "@/components/ui/loading-state";

export default function HistoryLoading() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-5 w-80 bg-muted rounded animate-pulse" />
      </div>

      {/* Overall Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              <div>
                <div className="h-6 w-16 bg-muted rounded animate-pulse mb-1" />
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Goals History skeleton */}
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingState key={i} type="list" />
        ))}
      </div>
    </div>
  );
} 