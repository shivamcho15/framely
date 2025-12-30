import { getPastDates } from './dates';

/**
 * Calculates simple stats for a habit over a range of days (default 7).
 */
export const getCompletionStats = (habit, completions, days = 7) => {
    const habitCompletions = completions.filter(c => c.habitId === habit.id);
    const completionSet = new Set(habitCompletions.map(c => c.date));

    const pastDates = getPastDates(days);
    const stats = pastDates.map(date => ({
        date,
        completed: completionSet.has(date)
    }));

    const totalCompleted = stats.filter(s => s.completed).length;

    return {
        stats,
        totalCompleted,
        completionRate: (totalCompleted / days) * 100
    };
};
