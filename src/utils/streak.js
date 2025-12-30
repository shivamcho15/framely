/**
 * Helper to get local date string YYYY-MM-DD
 */
export const getLocalDateString = (date) => {
    const d = new Date(date);
    const offset = d.getTimezoneOffset() * 60000;
    const localDate = new Date(d.getTime() - offset);
    return localDate.toISOString().split('T')[0];
};

/**
 * Checks if a given date is a scheduled day for the habit based on frequency.
 * @param {Date} date - The date to check.
 * @param {Object} frequency - The habit frequency object { type, days }.
 * @returns {boolean} - True if scheduled, false otherwise.
 */
export const isScheduled = (date, frequency) => {
    if (!frequency || frequency.type === 'everyday') return true;
    if (frequency.type === 'specific') {
        const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, etc.
        return frequency.days && frequency.days.includes(dayOfWeek);
    }
    return true;
};

/**
 * Calculates the current streak for a habit.
 * @param {Object} habit - The habit object.
 * @returns {number} - The current streak count.
 */
export const calculateStreak = (habit) => {
    const { completedDates, frequency } = habit;

    // Sort dates descending
    const sortedDates = completedDates ? [...completedDates].sort((a, b) => new Date(b) - new Date(a)) : [];

    const today = new Date();
    const todayStr = getLocalDateString(today);

    // Special logic for 'everyOtherDay'
    if (frequency && frequency.type === 'everyOtherDay') {
        if (!completedDates || completedDates.length === 0) return 0;

        const latestDateStr = sortedDates[0];

        const dayDiff = (d1, d2) => {
            const t1 = new Date(d1).setHours(0, 0, 0, 0);
            const t2 = new Date(d2).setHours(0, 0, 0, 0);
            return Math.round((t1 - t2) / (1000 * 60 * 60 * 24));
        };

        const gapFromToday = dayDiff(todayStr, latestDateStr);
        if (gapFromToday > 2) return 0; // Missed the window (> 1 day skip allowed, so max gap is 2 days? If Completed Mon, Due Wed. Today Thu. Gap 3. 0. Today Wed. Gap 2. OK.)

        // Now count backwards
        let streak = 1;
        for (let i = 0; i < sortedDates.length - 1; i++) {
            const current = sortedDates[i];
            const next = sortedDates[i + 1];
            const gap = dayDiff(current, next);

            // "Every other day" ideal gap is 2 (Mon -> Wed). 
            // If gap is 1 (Mon -> Tue), that's extra credit, keep streak.
            // If gap > 2, broken.
            if (gap <= 2) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    // Standard Logic (Every Day & Specific Days)
    let streak = 0;
    // Start checking from Today
    let currentCheck = new Date();
    let completedSet = new Set(completedDates || []);

    let daysChecked = 0;
    const MAX_LOOKBACK = 365 * 2;

    // Flag to handle the very first day (Today) logic
    // If Today is scheduled but NOT done: it's not a break yet, just doesn't increase streak.
    // If Today is scheduled AND DONE: streak starts at 1.
    // We iterate backwards.

    while (daysChecked < MAX_LOOKBACK) {
        const dateStr = getLocalDateString(currentCheck);
        const scheduled = isScheduled(currentCheck, frequency);
        const completed = completedSet.has(dateStr);

        if (scheduled) {
            if (completed) {
                streak++;
            } else {
                // Not completed
                if (dateStr === todayStr) {
                    // It's today. If we haven't done it yet, streak is preserved but doesn't increment.
                    // BUT, if we have a streak from yesterday, we want to return that.
                    // If we did it today, we already did streak++ above.
                    // So if we land here, it means Today is NOT done.
                    // We just continue to yesterday to see if the streak exists there.
                } else {
                    // Missed a PAST scheduled day. Streak broken.
                    break;
                }
            }
        } else {
            // Off-day. 
            // If we have a streak going, we just skip this day.
            // If we don't have a streak yet (e.g. started checking today, today is off-day),
            // current streak is 0, continue to yesterday.
        }

        // Move to yesterday
        currentCheck.setDate(currentCheck.getDate() - 1);
        daysChecked++;
    }

    return streak;
};
