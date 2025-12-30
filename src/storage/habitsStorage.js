import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@framely_habits_v2';

export const saveHabitsToStorage = async (habits) => {
    try {
        const jsonValue = JSON.stringify(habits);
        await AsyncStorage.setItem(HABITS_KEY, jsonValue);
    } catch (e) {
        console.error('Error saving habits:', e);
    }
};

export const loadHabitsFromStorage = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(HABITS_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error loading habits:', e);
        return [];
    }
};
