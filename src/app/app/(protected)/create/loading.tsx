import { LoadingState } from "@/components/ui/loading-state";

export default function CreateGoalLoading() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2" />
        <div className="h-5 w-96 bg-muted rounded animate-pulse" />
      </div>

      {/* Progress Bar skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-4 w-16 bg-muted rounded animate-pulse" />
        </div>
        <div className="w-full bg-muted rounded-full h-2 animate-pulse" />
      </div>

      {/* Form skeleton */}
      <LoadingState type="form" />
    </div>
  );
} 