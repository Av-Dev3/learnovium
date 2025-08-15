import { LoadingState } from "@/components/ui/loading-state";

export default function SettingsLoading() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-32 bg-muted rounded animate-pulse mb-2" />
        <div className="h-5 w-80 bg-muted rounded animate-pulse" />
      </div>

      {/* Profile Settings skeleton */}
      <div className="mb-8">
        <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4" />
        <LoadingState type="form" />
      </div>

      {/* Reminder Settings skeleton */}
      <div className="mb-8">
        <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4" />
        <LoadingState type="form" />
      </div>

      {/* Data & Privacy skeleton */}
      <div>
        <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="h-5 w-32 bg-muted rounded animate-pulse mb-1" />
                <div className="h-4 w-48 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 