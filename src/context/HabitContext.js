import React, { createContext, useState, useEffect, useContext } from 'react';
import { saveHabitsToStorage, loadHabitsFromStorage } from '../storage/habitsStorage';
import { saveCompletionsToStorage, loadCompletionsFromStorage } from '../storage/completionsStorage';
import { calculateStreak } from '../utils/streak';

const HabitContext = createContext();

export const useHabits = () => {
    return useContext(HabitContext);
};

export const HabitProvider = ({ children }) => {
    const [habits, setHabits] = useState([]);
    const [completions, setCompletions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const loadData = async () => {
            const [loadedHabits, loadedCompletions] = await Promise.all([
                loadHabitsFromStorage(),
                loadCompletionsFromStorage()
            ]);
            setHabits(loadedHabits);
            setCompletions(loadedCompletions);
            setLoading(false);
        };
        loadData();
    }, []);

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
        if (existingIndex > -1) {
            // Remove (Undo)
            updatedCompletions = [...completions];
            updatedCompletions.splice(existingIndex, 1);
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
    };

    // --- Helpers for Consumers ---

    /**
     * Get streak using normalized data.
     */
    const getStreak = (habit) => {
        // We pass ALL completions (or filtered ones) to the utility.
        // The utility `calculateStreak` expects `(habit, completionsArray)`.
        return calculateStreak(habit, completions);
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
            loading, 
            addHabit, 
            removeHabit, 
            updateHabit, 
            toggleHabitCompletion, 
            getStreak,
            getHabitCompletionDates 
        }}>
            {children}
        </HabitContext.Provider>
    );
};
