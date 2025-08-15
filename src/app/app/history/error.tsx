"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

interface HistoryErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function HistoryError({ error, reset }: HistoryErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("History error:", error);
  }, [error]);

  return (
    <ErrorState
      title="History Error"
      message="Something went wrong while loading your learning history. Please try again."
      onRetry={reset}
    />
  );
} 