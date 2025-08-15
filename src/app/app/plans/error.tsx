"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

interface PlansErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PlansError({ error, reset }: PlansErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Plans error:", error);
  }, [error]);

  return (
    <ErrorState
      title="Plans Error"
      message="Something went wrong while loading your learning plans. Please try again."
      onRetry={reset}
    />
  );
} 