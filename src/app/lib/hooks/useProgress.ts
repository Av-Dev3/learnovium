import useSWR from 'swr';
import { fetcher } from '../fetcher';
import type { Progress } from '../types';

export function useProgress(goalId?: string) {
  const url = goalId ? `/api/progress?goal_id=${goalId}` : '/api/progress';
  
  const { data, error, isLoading, mutate } = useSWR<Progress[]>(
    url,
    async (url) => {
      try {
        return await fetcher(url);
      } catch (err) {
        // If API fails, return empty array to prevent crashes
        console.warn('Failed to fetch progress, using defaults:', err);
        return [];
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes for progress
    }
  );

  return {
    progress: data || [],
    isLoading,
    isError: false, // Don't show error state, just empty data
    error,
    mutate,
  };
} 