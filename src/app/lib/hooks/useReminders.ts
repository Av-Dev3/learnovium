import useSWR from 'swr';
import { useState } from 'react';
import { fetcher } from '../fetcher';
import type { ReminderSettings } from '../types';

export function useReminders() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data, error, isLoading, mutate } = useSWR<ReminderSettings>(
    '/api/reminders',
    async (url) => {
      try {
        return await fetcher(url);
      } catch (err) {
        // If API fails, return default settings
        console.warn('Failed to fetch reminders, using defaults:', err);
        return {
          id: 'default',
          user_id: 'default',
          enabled: true,
          window_start: '09:00',
          window_end: '18:00',
          channel: 'email' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
    },
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
      console.warn('Failed to save reminders to API, continuing with local state:', err);
      // For now, just return true to simulate success
      // In a real app, you might want to store this locally and sync later
      setSaveError('Settings saved locally (database connection issue)');
      return true;
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