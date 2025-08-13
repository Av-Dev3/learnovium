import useSWR from 'swr';
import { fetcher } from '../fetcher';
import type { Goal } from '../types';

export function useGoals() {
  const { data, error, isLoading, mutate } = useSWR<Goal[]>(
    '/api/goals',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    goals: data || [],
    isLoading,
    isError: error,
    error,
    mutate,
  };
} 