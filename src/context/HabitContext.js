import React, { createContext, useState, useEffect, useContext } from 'react';
import { saveHabitsToStorage, loadHabitsFromStorage } from '../storage/habitsStorage';
import { saveCompletionsToStorage, loadCompletionsFromStorage } from '../storage/completionsStorage';
import { saveCoversToStorage, loadCoversFromStorage } from '../storage/coversStorage';
import { calculateStreak } from '../utils/streak';
import { evaluateMissedDays, handleRetroactiveCompletion } from '../utils/covers';
import { getCurrentMonthString } from '../utils/dates';

const HabitContext = createContext();

export const useHabits = () => {
    return useContext(HabitContext);
};

export const HabitProvider = ({ children }) => {
    const [habits, setHabits] = useState([]);
    const [completions, setCompletions] = useState([]);
    const [covers, setCovers] = useState({ coversRemaining: 2, coveredDates: [], lastCoverGrantMonth: null, lastEvaluationDate: null });
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const loadData = async () => {
            const [loadedHabits, loadedCompletions, loadedCovers] = await Promise.all([
                loadHabitsFromStorage(),
                loadCompletionsFromStorage(),
                loadCoversFromStorage()
            ]);
            setHabits(loadedHabits);
            setCompletions(loadedCompletions);
            setCovers(loadedCovers);

            // Check and grant monthly covers
            const updatedCovers = await checkAndGrantMonthlyCovers(loadedCovers);

            // Evaluate missed days and apply covers
            const evaluatedCovers = evaluateMissedDays(loadedHabits, loadedCompletions, updatedCovers);
            setCovers(evaluatedCovers);
            await saveCoversToStorage(evaluatedCovers);

            setLoading(false);
        };
        loadData();
    }, []);


    // --- Cover Management ---

    const checkAndGrantMonthlyCovers = async (currentCovers) => {
        const currentMonth = getCurrentMonthString();

        if (currentCovers.lastCoverGrantMonth !== currentMonth) {
            const newCoversRemaining = Math.min(currentCovers.coversRemaining + 1, 3);
            return {
                ...currentCovers,
                coversRemaining: newCoversRemaining,
                lastCoverGrantMonth: currentMonth
            };
        }

        return currentCovers;
    };

    // --- Actions ---

    const addHabit = async (habitData) => {
        const newHabit = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            ...habitData,
            // Do NOT store completedDates here anymore
        };
        const updatedHabits = [...habits, newHabit];
        setHabits(updatedHabits);
        await saveHabitsToStorage(updatedHabits);
    };

    const removeHabit = async (id) => {
        const updatedHabits = habits.filter((habit) => habit.id !== id);
        // Also remove associated completions to keep data clean
        const updatedCompletions = completions.filter(c => c.habitId !== id);

        setHabits(updatedHabits);
        setCompletions(updatedCompletions);

        await Promise.all([
            saveHabitsToStorage(updatedHabits),
            saveCompletionsToStorage(updatedCompletions)
        ]);
    };

    const updateHabit = async (id, updates) => {
        const updatedHabits = habits.map((habit) =>
            habit.id === id ? { ...habit, ...updates } : habit
        );
        setHabits(updatedHabits);
        await saveHabitsToStorage(updatedHabits);
    };

    /**
     * Toggles completion for a given habit on a specific date string (YYYY-MM-DD).
     * Now creates/deletes a Completion object.
     */
    const toggleHabitCompletion = async (habitId, dateStr) => {
        // Check if already exists
        const existingIndex = completions.findIndex(c => c.habitId === habitId && c.date === dateStr);

        let updatedCompletions;
        let wasRemoval = false;

        if (existingIndex > -1) {
            // Remove (Undo)
            updatedCompletions = [...completions];
            updatedCompletions.splice(existingIndex, 1);
            wasRemoval = true;
        } else {
            // Add
            const newCompletion = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                habitId,
                date: dateStr,
                createdAt: new Date().toISOString()
            };
            updatedCompletions = [...completions, newCompletion];
        }

        setCompletions(updatedCompletions);
        await saveCompletionsToStorage(updatedCompletions);

        // Handle retroactive completion (may free up a cover)
        if (!wasRemoval) {
            const updatedCovers = handleRetroactiveCompletion(dateStr, covers);
            if (updatedCovers !== covers) {
                setCovers(updatedCovers);
                await saveCoversToStorage(updatedCovers);
            }
        }

        // Re-evaluate covers
        const evaluatedCovers = evaluateMissedDays(habits, updatedCompletions, covers);
        setCovers(evaluatedCovers);
        await saveCoversToStorage(evaluatedCovers);
    };


    const pauseHabit = async (habitId, startDate, endDate) => {
        const updatedHabits = habits.map((habit) =>
            habit.id === habitId ? { ...habit, pauseStart: startDate, pauseEnd: endDate } : habit
        );
        setHabits(updatedHabits);
        await saveHabitsToStorage(updatedHabits);

        // Re-evaluate covers (paused days may free up covers)
        const evaluatedCovers = evaluateMissedDays(updatedHabits, completions, covers);
        setCovers(evaluatedCovers);
        await saveCoversToStorage(evaluatedCovers);
    };

    const resumeHabit = async (habitId) => {
        const updatedHabits = habits.map((habit) =>
            habit.id === habitId ? { ...habit, pauseStart: null, pauseEnd: null } : habit
        );
        setHabits(updatedHabits);
        await saveHabitsToStorage(updatedHabits);

        // Re-evaluate covers
        const evaluatedCovers = evaluateMissedDays(updatedHabits, completions, covers);
        setCovers(evaluatedCovers);
        await saveCoversToStorage(evaluatedCovers);
    };

    // --- Helpers for Consumers ---

    /**
     * Get streak using normalized data.
     */
    const getStreak = (habit) => {
        // We pass ALL completions (or filtered ones) to the utility.
        // The utility `calculateStreak` expects `(habit, completionsArray, covers)`.
        return calculateStreak(habit, completions, covers);
    };

    /**
     * Helper to get simpler arrays for components that just want to know if it's done.
     * Returns array of date strings for a specific habit.
     */
    const getHabitCompletionDates = (habitId) => {
        return completions
            .filter(c => c.habitId === habitId)
            .map(c => c.date);
    };

    return (
        <HabitContext.Provider value={{
            habits,
            completions,
            covers,
            loading,
            addHabit,
            removeHabit,
            updateHabit,
            toggleHabitCompletion,
            pauseHabit,
            resumeHabit,
            getStreak,
            getHabitCompletionDates
        }}>
            {children}
        </HabitContext.Provider>
    );
};
