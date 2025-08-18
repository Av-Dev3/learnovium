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
      fallbackData: [], // Provide empty array as fallback
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  // Ensure we always return a safe value
  const safeGoals = Array.isArray(data) ? data : [];

  return {
    goals: safeGoals,
    isLoading,
    isError: error,
    error,
    mutate,
  };
} 