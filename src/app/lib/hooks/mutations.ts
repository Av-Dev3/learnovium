import { mutate } from 'swr';

// Helper function to refresh goals cache
export async function mutateGoals() {
  return mutate('/api/goals');
}

// Helper function to refresh a specific goal's lesson cache
export async function mutateGoal(goalId: string) {
  return mutate(`/api/goals/${goalId}/today`);
}

// Helper function to refresh progress cache
export async function mutateProgress(goalId?: string) {
  const url = goalId ? `/api/progress?goal_id=${goalId}` : '/api/progress';
  return mutate(url);
}

// Helper function to refresh reminders cache
export async function mutateReminders() {
  return mutate('/api/reminders');
}

// Helper function to refresh all app-related caches
export async function mutateAll() {
  await Promise.all([
    mutateGoals(),
    mutateProgress(),
    mutateReminders(),
  ]);
} 