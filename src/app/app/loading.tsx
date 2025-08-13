import { LoadingState } from "@/components/ui/loading-state";

export default function AppLoading() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2" />
        <div className="h-5 w-96 bg-muted rounded animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
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

      {/* Today's Lessons skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <LoadingState key={i} type="lesson" />
          ))}
        </div>
      </div>

      {/* Active Goals skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-48 bg-muted rounded animate-pulse" />
          <div className="h-10 w-24 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <LoadingState key={i} type="goal" />
          ))}
        </div>
      </div>
    </div>
  );
} 