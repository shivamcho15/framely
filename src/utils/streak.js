import { getLocalDateString, getTodayDateString } from './dates';
import { isScheduledForDate } from './schedule';

/**
 * Calculates current streak based on normalized completions.
 * @param {Object} habit 
 * @param {Array<Object>} completions Array of { date: string, ... } objects
 * @param {Object} covers { coversRemaining, coveredDates }
 */
export const calculateStreak = (habit, completions, covers = { coveredDates: [] }) => {
    // 1. Filter completions for this habit
    // (Assuming caller passes filtered list, but safe to filter again if generic)
    const habitCompletions = completions.filter(c => c.habitId === habit.id);

    if (habitCompletions.length === 0) return 0;

    // 2. Get unique sorted dates (descending)
    const completedDates = [...new Set(habitCompletions.map(c => c.date))].sort().reverse();

    const todayStr = getTodayDateString();

    // 3. Handle 'everyOtherDay' logic
    if (habit.frequency.type === 'everyOtherDay') {
        // Filter to only include completions on scheduled days
        const scheduledCompletedDates = completedDates.filter(dateStr =>
            isScheduledForDate(habit, dateStr)
        );

        if (scheduledCompletedDates.length === 0) return 0;

        const latestDate = scheduledCompletedDates[0];
        const daysSinceLast = dayDiff(todayStr, latestDate);

        // If > 2 days since last completion, check if covered
        if (daysSinceLast > 2) {
            // Check if any day in between is covered
            const coveredSet = new Set(covers.coveredDates || []);
            let hasCover = false;
            for (let i = 1; i < daysSinceLast; i++) {
                const checkDate = new Date(latestDate + 'T12:00:00');
                checkDate.setDate(checkDate.getDate() + i);
                const checkDateStr = checkDate.toISOString().split('T')[0];
                if (coveredSet.has(checkDateStr)) {
                    hasCover = true;
                    break;
                }
            }
            if (!hasCover) return 0;
        }

        let streak = 1;
        for (let i = 0; i < scheduledCompletedDates.length - 1; i++) {
            const current = scheduledCompletedDates[i];
            const next = scheduledCompletedDates[i + 1]; // older
            const gap = dayDiff(current, next);

            // Allow gap of 1 or 2 (1 = consecutive, 2 = skipped one day)
            if (gap <= 2) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    // 4. Standard Logic
    let streak = 0;
    // We iterate backwards from Today or Yesterday.
    // If Today is completed, streak starts at 1, check yesterday.

    // Check if latest completion is relevant (today or yesterday) to keep streak alive
    const latest = completedDates[0];
    const diffToLatest = dayDiff(todayStr, latest);

    // If last completion was more than 1 day ago...
    if (diffToLatest > 1) {
        // ...check if the days IN BETWEEN were scheduled. 
        // If we missed a scheduled day, streak is 0. 
        // If all missed days were unscheduled (off-days), streak might still be alive?
        // Actually, simpler: Walk back day by day from Today.
    }

    let currentCheckDate = new Date(); // Start Today
    let daysChecked = 0;
    const MAX_LOOKBACK = 365 * 2; // Safety limit

    const completionSet = new Set(completedDates);
    const coveredSet = new Set(covers.coveredDates || []);

    // Initial check: If today is scheduled and NOT done, we don't count it for streak increment
    // but strictly, it hasn't BROKEN the streak yet if we look at yesterday.
    // However, if today IS done, we start counting from 1.

    // Correction: "Streak" usually means "Consecutive executions up to now".
    // If I did it yesterday (streak 10) and today is pending:
    // Display: 10 (🔥).
    // If I do it today: 11 (🔥).

    while (daysChecked < MAX_LOOKBACK) {
        const dateStr = getLocalDateString(currentCheckDate);
        const isScheduled = isScheduledForDate(habit, dateStr);
        const isDone = completionSet.has(dateStr);
        const isCovered = coveredSet.has(dateStr);

        if (isScheduled) {
            if (isDone) {
                streak++;
            } else if (isCovered) {
                // Covered day - doesn't increment streak but doesn't break it
                // Continue looking back
            } else {
                // Not done and not covered...
                if (dateStr === todayStr) {
                    // Allowed to be pending for today
                } else {
                    // Missed a past scheduled day! Streak ends.
                    break;
                }
            }
        } else {
            // Not scheduled (Off day or paused)
            // Does not increment streak, but does not break it.
            // Continue looking back.
        }

        // Move back 1 day
        currentCheckDate.setDate(currentCheckDate.getDate() - 1);
        daysChecked++;
    }

    return streak;
};

// Helper
const dayDiff = (dateStr1, dateStr2) => {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    // Normalize to noon to avoid DST/midnight shifts affecting diff
    d1.setHours(12, 0, 0, 0);
    d2.setHours(12, 0, 0, 0);
    return Math.round(Math.abs((d1 - d2) / (1000 * 60 * 60 * 24)));
};
