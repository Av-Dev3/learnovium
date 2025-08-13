# Data Hooks

This directory contains React hooks for data fetching and state management using SWR.

## Available Hooks

### `useGoals()`
Fetches all learning goals for the authenticated user.

```typescript
import { useGoals } from '@/app/lib/hooks';

function MyComponent() {
  const { goals, isLoading, isError, error, mutate } = useGoals();
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {goals.map(goal => (
        <div key={goal.id}>{goal.topic}</div>
      ))}
    </div>
  );
}
```

### `useLesson(goalId: string)`
Fetches today's lesson for a specific goal.

```typescript
import { useLesson } from '@/app/lib/hooks';

function LessonComponent({ goalId }: { goalId: string }) {
  const { lesson, isLoading, isError, error, mutate } = useLesson(goalId);
  
  if (isLoading) return <div>Loading lesson...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>{lesson?.title}</h1>
      <p>{lesson?.content}</p>
    </div>
  );
}
```

### `useProgress(goalId?: string)`
Fetches progress data, optionally filtered by goal ID.

```typescript
import { useProgress } from '@/app/lib/hooks';

function ProgressComponent({ goalId }: { goalId?: string }) {
  const { progress, isLoading, isError, error, mutate } = useProgress(goalId);
  
  if (isLoading) return <div>Loading progress...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {progress.map(p => (
        <div key={p.id}>Score: {p.score}%</div>
      ))}
    </div>
  );
}
```

### `useCreateGoal()`
Hook for creating new learning goals.

```typescript
import { useCreateGoal } from '@/app/lib/hooks';

function CreateGoalForm() {
  const { createGoal, isLoading, error, clearError } = useCreateGoal();
  
  const handleSubmit = async (data: CreateGoalRequest) => {
    const result = await createGoal(data);
    if (result) {
      // Goal created successfully
      console.log('Goal created:', result.id);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Goal'}
      </button>
    </form>
  );
}
```

### `useReminders()`
Fetches and manages reminder settings.

```typescript
import { useReminders } from '@/app/lib/hooks';

function RemindersComponent() {
  const { 
    reminders, 
    isLoading, 
    saveReminder, 
    isSaving, 
    saveError 
  } = useReminders();
  
  const handleSave = async (data: Partial<ReminderSettings>) => {
    const success = await saveReminder(data);
    if (success) {
      console.log('Reminders saved successfully');
    }
  };
  
  return (
    <div>
      {reminders && (
        <div>
          <label>
            <input 
              type="checkbox" 
              checked={reminders.enabled}
              onChange={(e) => handleSave({ enabled: e.target.checked })}
            />
            Enable reminders
          </label>
        </div>
      )}
    </div>
  );
}
```

## Mutation Helpers

### `mutateGoals()`
Refreshes the goals cache.

### `mutateGoal(goalId: string)`
Refreshes the lesson cache for a specific goal.

### `mutateProgress(goalId?: string)`
Refreshes the progress cache, optionally for a specific goal.

### `mutateReminders()`
Refreshes the reminders cache.

### `mutateAll()`
Refreshes all app-related caches.

```typescript
import { mutateGoals, mutateAll } from '@/app/lib/hooks';

// Refresh just goals
await mutateGoals();

// Refresh everything
await mutateAll();
```

## Configuration

All hooks use SWR with the following default configuration:
- `revalidateOnFocus: false` - Prevents unnecessary revalidation when switching tabs
- `revalidateOnReconnect: true` - Revalidates when network reconnects
- `dedupingInterval` - Varies by hook (1-10 minutes) to prevent excessive API calls

## Error Handling

All hooks provide error states and loading states. The fetcher utility automatically throws errors for non-2xx responses, which are caught and exposed through the hook's error state.

## TypeScript

All hooks are fully typed with TypeScript interfaces defined in `../types.ts`. 