import { getLocalDateString } from './dates';

/**
 * Checks if a habit is paused on a specific date.
 * @param {Object} habit 
 * @param {string} dateStr YYYY-MM-DD
 * @returns {boolean}
 */
export const isHabitPaused = (habit, dateStr) => {
    if (!habit.pauseStart || !habit.pauseEnd) return false;
    return dateStr >= habit.pauseStart && dateStr <= habit.pauseEnd;
};

/**
 * Checks if a habit is scheduled for a specific date string.
 * @param {Object} habit 
 * @param {string} dateStr YYYY-MM-DD
 * @returns {boolean}
 */
export const isScheduledForDate = (habit, dateStr) => {
    // Check pause first - paused days are never scheduled
    if (isHabitPaused(habit, dateStr)) {
        return false;
    }

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
        // Calculate days since a fixed epoch (e.g., UNIX epoch 1970-01-01)
        // We use the same 'checkDate' which is set to noon to avoid boundary issues.
        // We can just use the timestamp / msPerDay.
        // To be safe and consistent with "local" days, we rely on the fact that checkDate is constructed from local Y, M, D.
        // But simpler: just take the date string and treat it as UTC to count days?
        // Actually, existing checkDate is: new Date(y, m - 1, d, 12, 0, 0); -> Local time noon.
        // To get a consistent "day number", we can do:
        const start = new Date(habit.createdAt || 0); // Or use a fixed epoch like 0 if we want global sync
        // User requested "parity of the current day", implying global parity (e.g. Even dates are ON, Odd are OFF, or similar).
        // Let's use a fixed epoch (1970-01-01) so all "Every Other Day" habits align (or miss-align if created on different days? No, "parity of current day" usually means global).
        // Let's simply check if the day number is even.

        const msPerDay = 1000 * 60 * 60 * 24;
        const epoch = new Date(0); // 1970-01-01 UTC

        // We need the date in UTC to correctly calculate days since epoch without timezone shifts affecting the integer division on boundaries
        // dateStr is "YYYY-MM-DD".
        // Date.parse(dateStr) parses as UTC midnight.
        const utcTime = Date.parse(dateStr);

        if (isNaN(utcTime)) return true; // Fallback

        const daysSinceEpoch = Math.floor(utcTime / msPerDay);

        // Parity check: Even days = scheduled. (Or Odd. Arbitrary choice, but deterministic).
        return daysSinceEpoch % 2 === 0;
    }

    return true;
};
