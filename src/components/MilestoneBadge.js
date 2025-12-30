import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useHabits } from '../context/HabitContext';

const MilestoneBadge = ({ streak }) => {
    // Define milestones
    const milestones = [
        { value: 3, label: '3 Day Streak', color: '#B3E5FC', textColor: '#01579B', icon: '🥉' },
        { value: 7, label: '7 Day Streak', color: '#E1BEE7', textColor: '#4A148C', icon: '🥈' },
        { value: 14, label: '2 Week Streak', color: '#FFF9C4', textColor: '#F57F17', icon: '🥇' },
        { value: 30, label: '30 Day Streak', color: '#FFCCBC', textColor: '#BF360C', icon: '🏆' },
        { value: 90, label: '3 Month Streak', color: '#D1C4E9', textColor: '#311B92', icon: '👑' },
    ];

    // Find highest achieved milestone
    const achieved = milestones.filter(m => streak >= m.value).sort((a, b) => b.value - a.value)[0];

    if (!achieved) return null;

    return (
        <View style={[styles.badge, { backgroundColor: achieved.color }]}>
            <Text style={styles.icon}>{achieved.icon}</Text>
            <Text style={[styles.text, { color: achieved.textColor }]}>{achieved.label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    icon: {
        fontSize: 16,
        marginRight: 6,
    },
    text: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default MilestoneBadge;
