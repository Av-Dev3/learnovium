import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className, 
  showLabel = true,
  size = "md" 
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn(
        "w-full bg-muted rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <div
          className={cn(
            "h-full bg-primary transition-all duration-500 ease-out rounded-full",
            sizeClasses[size]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
} 