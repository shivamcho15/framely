/**
 * Formats a Date object to a local YYYY-MM-DD string.
 * This ensures we are always working with the user's "calendar date"
 * regardless of the time of day or UTC offset.
 * 
 * @param {Date} date 
 * @returns {string} YYYY-MM-DD
 */
export const getLocalDateString = (date) => {
    const d = new Date(date);
    // Get the offset in milliseconds
    const offset = d.getTimezoneOffset() * 60000;
    // Adjust the date to local time before ISO conversion
    // (ISO string is always UTC, so we shift the time so the UTC value matches local time)
    const localDate = new Date(d.getTime() - offset);
    return localDate.toISOString().split('T')[0];
};

/**
 * Returns today's date as a local YYYY-MM-DD string.
 */
export const getTodayDateString = () => {
    return getLocalDateString(new Date());
};

/**
 * Checks if a date string is in the future relative to today.
 * @param {string} dateStr YYYY-MM-DD
 * @returns {boolean}
 */
export const isFutureDate = (dateStr) => {
    const today = getTodayDateString();
    return dateStr > today;
};

/**
 * Returns an array of date strings for the past N days including today.
 * Useful for charts and lookbacks.
 * @param {number} daysCount 
 */
export const getPastDates = (daysCount) => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < daysCount; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        dates.push(getLocalDateString(d));
    }
    // Return chronological order
    return dates.reverse();
};

/**
 * Returns current month in YYYY-MM format.
 * @returns {string} YYYY-MM
 */
export const getCurrentMonthString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};

/**
 * Adds days to a date string and returns new date string.
 * @param {string} dateStr YYYY-MM-DD
 * @param {number} days Number of days to add (can be negative)
 * @returns {string} YYYY-MM-DD
 */
export const addDays = (dateStr, days) => {
    const date = new Date(dateStr + 'T12:00:00'); // Noon to avoid timezone issues
    date.setDate(date.getDate() + days);
    return getLocalDateString(date);
};

/**
 * Returns the first day of the current month in YYYY-MM-DD format.
 * @returns {string} YYYY-MM-DD
 */
export const getStartOfCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
};
