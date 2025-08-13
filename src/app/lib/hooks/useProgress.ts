import useSWR from 'swr';
import { fetcher } from '../fetcher';
import type { Progress } from '../types';

export function useProgress(goalId?: string) {
  const url = goalId ? `/api/progress?goal_id=${goalId}` : '/api/progress';
  
  const { data, error, isLoading, mutate } = useSWR<Progress[]>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes for progress
    }
  );

  return {
    progress: data || [],
    isLoading,
    isError: error,
    error,
    mutate,
  };
} 