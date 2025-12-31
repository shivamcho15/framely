import React, { useState, useMemo } from 'react';
import { View, StyleSheet, SectionList, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { useHabits } from '../context/HabitContext';
import HabitCard from '../components/HabitCard';
import AddHabitModal from '../components/AddHabitModal';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { getTodayDateString, addDays } from '../utils/dates';
import { isScheduledForDate, isHabitPaused } from '../utils/schedule';

const HomeScreen = () => {
    const { habits, addHabit, covers } = useHabits();
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const handleAddHabit = (habitData) => {
        addHabit(habitData);
    };

    const openDetail = (habit) => {
        navigation.navigate('HabitDetail', { habitId: habit.id });
    };

    // Categorize and sort habits into sections
    const sections = useMemo(() => {
        const today = getTodayDateString();
        const tomorrow = addDays(today, 1);

        const todayHabits = [];
        const tomorrowHabits = [];
        const pausedHabits = [];

        habits.forEach(habit => {
            // Check if paused first (priority)
            if (isHabitPaused(habit, today)) {
                pausedHabits.push(habit);
            } else if (isScheduledForDate(habit, today)) {
                todayHabits.push(habit);
            } else if (isScheduledForDate(habit, tomorrow)) {
                tomorrowHabits.push(habit);
            }
        });

        // Sort alphabetically by title
        const sortByTitle = (a, b) => a.title.localeCompare(b.title);
        todayHabits.sort(sortByTitle);
        tomorrowHabits.sort(sortByTitle);
        pausedHabits.sort(sortByTitle);

        // Build sections array (only include non-empty sections)
        const result = [];
        if (todayHabits.length > 0) {
            result.push({ title: 'Today', data: todayHabits });
        }
        if (tomorrowHabits.length > 0) {
            result.push({ title: 'Tomorrow', data: tomorrowHabits });
        }
        if (pausedHabits.length > 0) {
            result.push({ title: 'Paused', data: pausedHabits });
        }

        return result;
    }, [habits]);

    const renderSectionHeader = ({ section: { title } }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    const renderHabit = ({ item, section }) => {
        const isPaused = section.title === 'Paused';
        return (
            <View style={isPaused && styles.pausedHabitContainer}>
                <HabitCard habit={item} onPress={() => openDetail(item)} />
                {isPaused && (
                    <View style={styles.pausedBadge}>
                        <Text style={styles.pausedBadgeText}>
                            Paused until {new Date(item.pauseEnd).toLocaleDateString()}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <Text style={styles.title}>My Habits</Text>
                <View style={styles.coversContainer}>
                    <Text style={styles.coversLabel}>Covers remaining:</Text>
                    <Text style={styles.coversCount}>{covers?.coversRemaining ?? 2}</Text>
                </View>
            </View>

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={renderHabit}
                renderSectionHeader={renderSectionHeader}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No habits yet. Start by adding one!</Text>
                    </View>
                }
                stickySectionHeadersEnabled={false}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            <AddHabitModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAdd={handleAddHabit}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    coversContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    coversLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 6,
    },
    coversCount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    sectionHeader: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    pausedHabitContainer: {
        opacity: 0.6,
    },
    pausedBadge: {
        backgroundColor: '#FFF3CD',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginTop: -8,
        marginBottom: 12,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#FFE69C',
    },
    pausedBadgeText: {
        color: '#856404',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    fabText: {
        fontSize: 32,
        color: '#fff',
        lineHeight: 32,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
    }
});

export default HomeScreen;
