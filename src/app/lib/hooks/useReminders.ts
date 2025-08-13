import useSWR from 'swr';
import { useState } from 'react';
import { fetcher } from '../fetcher';
import type { ReminderSettings } from '../types';

export function useReminders() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data, error, isLoading, mutate } = useSWR<ReminderSettings>(
    '/api/reminders',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // 10 minutes for reminders
    }
  );

  const saveReminder = async (reminderData: Partial<ReminderSettings>): Promise<boolean> => {
    try {
      setIsSaving(true);
      setSaveError(null);

      await fetcher('/api/reminders', {
        method: 'POST',
        body: JSON.stringify(reminderData),
      });

      // Revalidate reminders cache
      await mutate();

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save reminder settings';
      setSaveError(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    reminders: data,
    isLoading,
    isError: error,
    error,
    mutate,
    saveReminder,
    isSaving,
    saveError,
    clearSaveError: () => setSaveError(null),
  };
} 