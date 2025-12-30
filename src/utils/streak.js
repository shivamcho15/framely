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
    // 'everyOtherDay' is dynamic, treated as always scheduled for this check 
    // but handled specially in streak calc or handled loosely.
    // For the loop logic, we might need a different approach for everyOtherDay.
    return true;
};

/**
 * Calculates the current streak for a habit.
 * @param {Object} habit - The habit object.
 * @returns {number} - The current streak count.
 */
export const calculateStreak = (habit) => {
    const { completedDates, frequency } = habit;

    if (!completedDates || completedDates.length === 0) return 0;

    // 1. Sort dates descending
    const sortedDates = [...completedDates].sort((a, b) => new Date(b) - new Date(a));
    const latestDateStr = sortedDates[0];
    const latestDate = new Date(latestDateStr);

    // 2. Normalize Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    // Special logic for 'everyOtherDay'
    // Constraint: Max gap between completions is 1 day (i.e., difference <= 2 days)
    if (frequency && frequency.type === 'everyOtherDay') {
        let streak = 0;

        // Use 'today' as the anchor to start checking? 
        // Or simple check: If latest completion is too old (> 2 days ago), streak is 0.
        // If latest is today or yesterday or 2 days ago? 
        // "Every other day" -> If I did it 2 days ago (Day -2), today I am due.
        // If I haven't done it yet today, streak survives.
        // If I did it 3 days ago, streak broken.

        const diffDays = (today - latestDate) / (1000 * 60 * 60 * 24);

        // If the gap from today to last completion is > 2, streak is definitively 0.
        // Note: Math.floor/round might be needed depending on timezone, 
        // but text-based ISO dates usually align well if we stick to UTC or consistent local.
        // Let's rely on date string diffs for safety.

        const dayDiff = (d1, d2) => {
            const t1 = new Date(d1).setHours(0, 0, 0, 0);
            const t2 = new Date(d2).setHours(0, 0, 0, 0);
            return Math.round((t1 - t2) / (1000 * 60 * 60 * 24));
        };

        const gapFromToday = dayDiff(todayStr, latestDateStr);
        if (gapFromToday > 2) return 0; // Missed the window

        // Now count backwards
        streak = 1;
        for (let i = 0; i < sortedDates.length - 1; i++) {
            const current = sortedDates[i];
            const next = sortedDates[i + 1];
            const gap = dayDiff(current, next);

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
    let currentCheck = new Date(today); // Start checking from Today
    let completedSet = new Set(completedDates);

    // Safety break to prevent infinite loops
    let daysChecked = 0;

    // We iterate backwards day by day.
    // Logic: 
    // 1. Is 'currentCheck' scheduled?
    //    YES: Must be completed.
    //         If completed -> streak++. Move to prev day.
    //         If NOT completed:
    //             If currentCheck is TODAY -> Grace period (Streak doesn't break, doesn't increment). Move to prev day.
    //             Else -> Break streak.
    //    NO: Off-day. Streak continues. Move to prev day.

    while (daysChecked < 365 * 2) { // Max 2 years lookback
        const dateStr = currentCheck.toISOString().split('T')[0];
        const scheduled = isScheduled(currentCheck, frequency);
        const completed = completedSet.has(dateStr);

        if (scheduled) {
            if (completed) {
                streak++;
            } else {
                // Not completed
                if (dateStr === todayStr) {
                    // Allowed to be incomplete today
                } else {
                    // Missed a past scheduled day
                    break;
                }
            }
        } else {
            // Off-day, just continue
        }

        // Move to yesterday
        currentCheck.setDate(currentCheck.getDate() - 1);
        daysChecked++;

        // Optimization: If we run out of completed dates to check against? 
        // This loop goes until break.
        // If streak exceeds accumulated completedDates count? No, because off-days don't increment streak.
    }

    return streak;
};
