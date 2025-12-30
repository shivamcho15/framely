import { getLocalDateString } from './dates';

/**
 * Checks if a habit is scheduled for a specific date string.
 * @param {Object} habit 
 * @param {string} dateStr YYYY-MM-DD
 * @returns {boolean}
 */
export const isScheduledForDate = (habit, dateStr) => {
    const { frequency } = habit;
    const date = new Date(dateStr);
    // Correct for timezone parsing issue: "YYYY-MM-DD" fits UTC midnight.
    // We want the day of week for that specific date.
    // Ideally we parse YYYY, MM, DD manually to be safe or use a library, 
    // but assuming standard environment:
    // A safest way to get day of week from YYYY-MM-DD without UTC shift issues:
    // Create date with time 12:00:00 to avoid midnight boundary issues
    const [y, m, d] = dateStr.split('-').map(Number);
    const checkDate = new Date(y, m - 1, d, 12, 0, 0);

    if (frequency.type === 'everyday') return true;

    if (frequency.type === 'specific') {
        const dayOfWeek = checkDate.getDay(); // 0=Sun
        return frequency.days && frequency.days.includes(dayOfWeek);
    }

    if (frequency.type === 'everyOtherDay') {
        // Dynamic schedule check is complex without context of previous completions.
        // For simple "is this day valid to do it?", everyOtherDay is technically ALWAYS valid 
        // unless you did it yesterday. 
        // But for visualization "Should this be a box?", usually we treat it as always valid/scheduled
        // or we need more complex logic. 
        // Simplification: Every day is a POTENTIAL day for everyOtherDay.
        return true;
    }

    return true;
};
