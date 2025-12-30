import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPLETIONS_KEY = '@framely_completions_v2';

export const saveCompletionsToStorage = async (completions) => {
    try {
        const jsonValue = JSON.stringify(completions);
        await AsyncStorage.setItem(COMPLETIONS_KEY, jsonValue);
    } catch (e) {
        console.error('Error saving completions:', e);
    }
};

export const loadCompletionsFromStorage = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(COMPLETIONS_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error loading completions:', e);
        return [];
    }
};
