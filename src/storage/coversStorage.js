import AsyncStorage from '@react-native-async-storage/async-storage';

const COVERS_KEY = '@framely_covers_v1';

export const saveCoversToStorage = async (coversData) => {
    try {
        const jsonValue = JSON.stringify(coversData);
        await AsyncStorage.setItem(COVERS_KEY, jsonValue);
    } catch (e) {
        console.error('Error saving covers:', e);
    }
};

export const loadCoversFromStorage = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(COVERS_KEY);
        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        }
        // Default initial state
        return {
            coversRemaining: 2,
            coveredDates: [],
            lastCoverGrantMonth: null,
            lastEvaluationDate: null
        };
    } catch (e) {
        console.error('Error loading covers:', e);
        return {
            coversRemaining: 2,
            coveredDates: [],
            lastCoverGrantMonth: null,
            lastEvaluationDate: null
        };
    }
};
