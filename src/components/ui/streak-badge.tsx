import { Badge } from "@/components/ui/badge";
import { TrendingUp, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  streak: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StreakBadge({ streak, size = "md", className }: StreakBadgeProps) {
  if (streak === 0) return null;

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return "bg-orange-100 text-orange-800 border-orange-200";
    if (streak >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 7) return <Flame className={iconSizes[size]} />;
    return <TrendingUp className={iconSizes[size]} />;
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "flex items-center gap-1.5 font-medium",
        sizeClasses[size],
        getStreakColor(streak),
        className
      )}
    >
      {getStreakIcon(streak)}
      <span>{streak} day{streak !== 1 ? 's' : ''} streak</span>
    </Badge>
  );
} 