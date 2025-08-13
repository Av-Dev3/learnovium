"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { success, error as showError } from "@/app/lib/toast";
import { mutateGoal, mutateGoals, mutateProgress } from "@/app/lib/hooks/mutations";

interface MarkCompleteButtonProps {
  goalId: string;
  dayIndex?: number;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function MarkCompleteButton({ 
  goalId, 
  dayIndex, 
  className,
  variant = "default",
  size = "default"
}: MarkCompleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkComplete = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal_id: goalId,
          status: "completed",
          day_index: dayIndex ?? "auto"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Show success toast
      success("Great job! You've marked this lesson as complete.");

      // Revalidate SWR caches
      await Promise.all([
        mutateGoal(goalId),
        mutateGoals(),
        mutateProgress(goalId),
      ]);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to mark lesson as complete";
      
      // Show error toast
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleMarkComplete}
      disabled={isLoading}
      className={className}
      variant={variant}
      size={size}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Marking Complete...
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark Complete
        </>
      )}
    </Button>
  );
} 