import useSWR from 'swr';
import { fetcher } from '../fetcher';
import type { Lesson } from '../types';

interface LessonResponse {
  reused: boolean;
  lesson: Lesson;
}

export function useLesson(goalId: string) {
  const { data, error, isLoading, mutate } = useSWR<LessonResponse>(
    goalId ? `/api/goals/${goalId}/today` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes for lessons
    }
  );

  return {
    lesson: data?.lesson,
    isReused: data?.reused || false,
    isLoading,
    isError: error,
    error,
    mutate,
  };
} 