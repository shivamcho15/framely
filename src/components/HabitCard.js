import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useHabits } from '../context/HabitContext';
import StreakBadge from './StreakBadge';

const HabitCard = ({ habit, onPress }) => {
    const { toggleHabitCompletion, getStreak } = useHabits();
    const streak = getStreak(habit);

    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = habit.completedDates?.includes(today);

    const handleToggle = () => {
        toggleHabitCompletion(habit.id, today);
    };

    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{habit.title}</Text>
                    <StreakBadge streak={streak} />
                </View>
                {habit.description ? (
                    <Text style={styles.description} numberOfLines={2}>
                        {habit.description}
                    </Text>
                ) : null}
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.checkButton, isCompletedToday && styles.checkedButton]}
                    onPress={handleToggle}
                >
                    <Text style={[styles.checkText, isCompletedToday && styles.checkedText]}>
                        {isCompletedToday ? '✓' : '○'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <Text style={styles.buttonText}>Details</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    content: {
        flex: 1,
        marginRight: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    checkButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    checkedButton: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    checkText: {
        fontSize: 20,
        color: '#999',
    },
    checkedText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default HabitCard;
