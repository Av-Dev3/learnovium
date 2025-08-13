"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

interface AppErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("App error:", error);
  }, [error]);

  return (
    <ErrorState
      title="Dashboard Error"
      message="Something went wrong while loading your dashboard. Please try again."
      onRetry={reset}
    />
  );
} 