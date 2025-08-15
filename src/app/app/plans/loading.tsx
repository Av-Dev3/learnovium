import { LoadingState } from "@/components/ui/loading-state";

export default function PlansLoading() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-5 w-80 bg-muted rounded animate-pulse" />
      </div>

      {/* Controls skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="h-10 w-full bg-muted rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        <div className="h-10 w-24 bg-muted rounded animate-pulse" />
      </div>

      {/* Goals Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingState key={i} type="goal" />
        ))}
      </div>

      {/* Summary Stats skeleton */}
      <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <div className="h-6 w-24 bg-muted rounded animate-pulse mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-8 w-16 bg-muted rounded animate-pulse mx-auto mb-1" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 