import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useHabits } from '../context/HabitContext';
import StreakBadge from './StreakBadge';
import { getLocalDateString } from '../utils/dates';

const HabitCard = ({ habit }) => {
    const navigation = useNavigation();
    const { toggleHabitCompletion, getStreak, getHabitCompletionDates } = useHabits();

    // Safe check for completedDates
    // FIX: Use getLocalDateString to ensure we check against the correct LOCAL today
    const today = new Date();
    const todayStr = getLocalDateString(today);
    const completedDates = getHabitCompletionDates(habit.id);
    const isCompletedToday = completedDates && completedDates.includes(todayStr);

    const streak = getStreak(habit);

    // Use habit color or default blue
    const accentColor = habit.color || '#2196F3';

    return (
        <TouchableOpacity
            style={[styles.card, { borderLeftColor: accentColor }]}
            onPress={() => navigation.navigate('HabitDetail', { habitId: habit.id })}
        >
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

            <TouchableOpacity
                style={[
                    styles.checkButton,
                    isCompletedToday && { backgroundColor: accentColor, borderColor: accentColor },
                    !isCompletedToday && { borderColor: accentColor }
                ]}
                onPress={() => toggleHabitCompletion(habit.id, todayStr)}
            >
                {isCompletedToday && <Text style={styles.checkIcon}>✓</Text>}
            </TouchableOpacity>
        </TouchableOpacity>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 5,
    },
    content: {
        flex: 1,
        marginRight: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    checkButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkIcon: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default HabitCard;
