import { useState } from 'react';
import { fetcher } from '../fetcher';
import type { CreateGoalRequest, CreateGoalResponse } from '../types';
import { mutateGoals } from './mutations';

export function useCreateGoal() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGoal = async (goalData: CreateGoalRequest): Promise<CreateGoalResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetcher<CreateGoalResponse>('/api/goals', {
        method: 'POST',
        body: JSON.stringify(goalData),
      });

      // Invalidate and revalidate goals cache
      await mutateGoals();

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create goal';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createGoal,
    isLoading,
    error,
    clearError: () => setError(null),
  };
} 