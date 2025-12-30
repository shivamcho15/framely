# Framely Internal Rules

## Core Philosophy
1.  **Normalization**: Data correctness is prioritized over ease of access. Habits and Completions are separate entities.
2.  **Immutability**: Completions are historical records. They refer to a habit but are not *owned* by the habit object in storage.
3.  **Pure Logic**: Visual components should not contain business logic. All calculations (streaks, scheduling) happen in pure utility functions.

## Data Model References

### Habit
```typescript
interface Habit {
  id: string;
  title: string;
  description?: string;
  color: string;
  frequency: {
    type: 'everyday' | 'everyOtherDay' | 'specific';
    days?: number[]; // 0=Sun, 6=Sat
  };
  reminders: string[];
  createdAt: string;
}
```

### Completion
```typescript
interface Completion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD (Local Time)
  createdAt: string;
}
```

## Logic Rules

### Scheduling
- **"Streaks only count scheduled days"**: If a user is not scheduled to perform a habit on Tuesday, missing it does not break their streak.
- **"Every Other Day"**: This is a dynamic schedule. It checks the last completion and ensures the gap does not exceed 2 days.

### Completions
- **Immutable**: Once a completion is recorded, it stands as a record. To "undo", we delete the record.
- **Local Time**: All dates are stored as `YYYY-MM-DD` strings based on the user's local timezone at the moment of completion.
- **Future Completions**: Users cannot mark habits as done for future dates.

### Visualization
- **No Raw Computation**: Components like `HabitProgressChart` accept prepared data (e.g., `isScheduled`, `isCompleted`) or use selectors/hooks that utilize the utility layer. They do not implement streak logic themselves.
