import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DAYS = [
    { label: 'S', value: 0 },
    { label: 'M', value: 1 },
    { label: 'T', value: 2 },
    { label: 'W', value: 3 },
    { label: 'T', value: 4 },
    { label: 'F', value: 5 },
    { label: 'S', value: 6 },
];

const WeekDaySelector = ({ selectedDays, onChange }) => {
    const toggleDay = (dayValue) => {
        let newDays;
        if (selectedDays.includes(dayValue)) {
            newDays = selectedDays.filter((d) => d !== dayValue);
        } else {
            newDays = [...selectedDays, dayValue].sort();
        }
        onChange(newDays);
    };

    return (
        <View style={styles.container}>
            {DAYS.map((day) => {
                const isSelected = selectedDays.includes(day.value);
                return (
                    <TouchableOpacity
                        key={day.value}
                        style={[styles.dayButton, isSelected && styles.selectedDay]}
                        onPress={() => toggleDay(day.value)}
                    >
                        <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                            {day.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    dayButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedDay: {
        backgroundColor: '#007AFF',
    },
    dayText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    selectedDayText: {
        color: '#fff',
    },
});

export default WeekDaySelector;
