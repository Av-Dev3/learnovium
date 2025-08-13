import useSWR from 'swr';
import { fetcher } from '../fetcher';
import type { Lesson } from '../types';

export function useLesson(goalId: string) {
  const { data, error, isLoading, mutate } = useSWR<Lesson>(
    goalId ? `/api/goals/${goalId}/today` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes for lessons
    }
  );

  return {
    lesson: data,
    isLoading,
    isError: error,
    error,
    mutate,
  };
} 