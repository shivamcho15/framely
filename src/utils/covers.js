import { isScheduledForDate, isHabitPaused } from './schedule';
import { getStartOfCurrentMonth, getTodayDateString } from './dates';

/**
 * Evaluates missed days and applies covers where needed.
 * Only evaluates from start of current month or last evaluation date.
 * @param {Array} habits 
 * @param {Array} completions 
 * @param {Object} covers { coversRemaining, coveredDates, lastEvaluationDate }
 * @returns {Object} Updated covers object
 */
export const evaluateMissedDays = (habits, completions, covers) => {
    if (habits.length === 0) return covers;

    const today = getTodayDateString();
    const startOfMonth = getStartOfCurrentMonth();

    // Determine evaluation start date
    const evaluationStart = covers.lastEvaluationDate
        ? (covers.lastEvaluationDate > startOfMonth ? covers.lastEvaluationDate : startOfMonth)
        : startOfMonth;

    // Create a set of completed dates for fast lookup
    const completionSet = new Set(completions.map(c => c.date));
    const coveredSet = new Set(covers.coveredDates || []);

    let newCoversRemaining = covers.coversRemaining;
    const newCoveredDates = [...(covers.coveredDates || [])];

    // Iterate through dates from evaluation start to today
    let currentDate = evaluationStart;
    while (currentDate <= today) {
        // Check if any habit was missed on this date
        let anyHabitMissed = false;

        for (const habit of habits) {
            const isScheduled = isScheduledForDate(habit, currentDate);
            const isCompleted = completionSet.has(currentDate);
            const isPaused = isHabitPaused(habit, currentDate);

            // A habit is "missed" if it was scheduled, not completed, and not paused
            if (isScheduled && !isCompleted && !isPaused) {
                anyHabitMissed = true;
                break; // One missed habit is enough for this date
            }
        }

        // If any habit was missed and we have covers available and date not already covered
        if (anyHabitMissed && newCoversRemaining > 0 && !coveredSet.has(currentDate)) {
            newCoveredDates.push(currentDate);
            coveredSet.add(currentDate);
            newCoversRemaining--;
        }

        // Move to next day
        const date = new Date(currentDate + 'T12:00:00');
        date.setDate(date.getDate() + 1);
        currentDate = date.toISOString().split('T')[0];
    }

    return {
        coversRemaining: newCoversRemaining,
        coveredDates: newCoveredDates,
        lastCoverGrantMonth: covers.lastCoverGrantMonth,
        lastEvaluationDate: today
    };
};

/**
 * Handles retroactive completion - frees up a cover if the completion fills
 * the most recent covered date.
 * @param {string} completedDate YYYY-MM-DD
 * @param {Object} covers 
 * @returns {Object} Updated covers object
 */
export const handleRetroactiveCompletion = (completedDate, covers) => {
    if (!covers.coveredDates || covers.coveredDates.length === 0) {
        return covers;
    }

    // Sort covered dates to find the most recent
    const sortedCoveredDates = [...covers.coveredDates].sort().reverse();
    const mostRecentCovered = sortedCoveredDates[0];

    // If the completion fills the most recent covered date, free up the cover
    if (completedDate === mostRecentCovered) {
        return {
            ...covers,
            coversRemaining: Math.min(covers.coversRemaining + 1, 3),
            coveredDates: covers.coveredDates.filter(d => d !== completedDate)
        };
    }

    return covers;
};
