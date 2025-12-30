import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useHabits } from '../context/HabitContext';
import HabitProgressChart from '../components/HabitProgressChart';
import MilestoneBadge from '../components/MilestoneBadge';

const VisualizationScreen = () => {
    const { habits, getStreak } = useHabits();

    if (habits.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>No habits to visualize yet!</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.header}>Your Progress</Text>

            {habits.map((habit) => {
                const streak = getStreak(habit);
                return (
                    <View key={habit.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.habitTitle}>{habit.title}</Text>
                            <View style={styles.streakContainer}>
                                <Text style={styles.streakText}>🔥 {streak}</Text>
                            </View>
                        </View>

                        <MilestoneBadge streak={streak} />
                        <HabitProgressChart habit={habit} />
                    </View>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
        paddingTop: 60, // Safe area
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 24,
    },
    card: {
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    habitTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    streakContainer: {
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    streakText: {
        fontWeight: 'bold',
        color: '#E65100',
    }
});

export default VisualizationScreen;
