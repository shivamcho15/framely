import React, { createContext, useState, useEffect, useContext } from 'react';
import { saveHabits, loadHabits } from '../utils/storage';
import { calculateStreak } from '../utils/streak';

const HabitContext = createContext();

export const useHabits = () => {
    return useContext(HabitContext);
};

export const HabitProvider = ({ children }) => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHabits = async () => {
            const loadedHabits = await loadHabits();
            setHabits(loadedHabits);
            setLoading(false);
        };
        fetchHabits();
    }, []);

    const addHabit = async (habitData) => {
        const newHabit = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            completedDates: [],
            ...habitData,
        };
        const updatedHabits = [...habits, newHabit];
        setHabits(updatedHabits);
        await saveHabits(updatedHabits);
    };

    const removeHabit = async (id) => {
        const updatedHabits = habits.filter((habit) => habit.id !== id);
        setHabits(updatedHabits);
        await saveHabits(updatedHabits);
    };

    const updateHabit = async (id, updates) => {
        const updatedHabits = habits.map((habit) =>
            habit.id === id ? { ...habit, ...updates } : habit
        );
        setHabits(updatedHabits);
        await saveHabits(updatedHabits);
    };

    const toggleHabitCompletion = async (id, date) => {
        const updatedHabits = habits.map((habit) => {
            if (habit.id === id) {
                const completedDates = habit.completedDates || [];
                const dateIndex = completedDates.indexOf(date);
                let newCompletedDates;

                if (dateIndex > -1) {
                    // Remove if already completed
                    newCompletedDates = completedDates.filter(d => d !== date);
                } else {
                    // Add if not completed
                    newCompletedDates = [...completedDates, date];
                }
                return { ...habit, completedDates: newCompletedDates };
            }
            return habit;
        });
        setHabits(updatedHabits);
        await saveHabits(updatedHabits);
    };

    const getStreak = (habit) => {
        return calculateStreak(habit);
    };

    return (
        <HabitContext.Provider value={{ habits, loading, addHabit, removeHabit, updateHabit, toggleHabitCompletion, getStreak }}>
            {children}
        </HabitContext.Provider>
    );
};
