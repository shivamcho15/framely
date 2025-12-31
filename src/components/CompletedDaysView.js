import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { isHabitPaused } from '../utils/schedule';
import { getPastDates } from '../utils/dates';

const CompletedDaysView = ({ completedDates, coveredDates = [], habit }) => {
    // Get last 30 days for visualization
    const allDates = getPastDates(30);

    // Filter to only show dates after habit was created
    const habitCreatedDate = habit?.createdAt ? habit.createdAt.split('T')[0] : null;
    const dates = habitCreatedDate
        ? allDates.filter(d => d >= habitCreatedDate)
        : allDates;

    const completedSet = new Set(completedDates || []);
    const coveredSet = new Set(coveredDates || []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const getDayState = (dateStr) => {
        // Priority: Paused > Completed > Covered > Missed
        if (habit && isHabitPaused(habit, dateStr)) {
            return 'paused';
        }
        if (completedSet.has(dateStr)) {
            return 'completed';
        }
        if (coveredSet.has(dateStr)) {
            return 'covered';
        }
        return null; // Not relevant
    };

    const handleDayPress = (dateStr, state) => {
        if (state === 'covered') {
            Alert.alert('Covered Day', 'This day was covered automatically.');
        }
        // No interaction for paused days
    };

    const renderDay = ({ item: dateStr }) => {
        const state = getDayState(dateStr);

        if (!state) return null; // Don't show days that aren't completed, covered, or paused

        let badgeStyle = styles.dateBadge;
        let textStyle = styles.dateText;
        let iconStyle = styles.checkIcon;
        let iconContent = '✓';

        if (state === 'paused') {
            badgeStyle = [styles.dateBadge, styles.pausedBadge];
            textStyle = [styles.dateText, styles.pausedText];
            iconStyle = [styles.checkIcon, styles.pausedIcon];
            iconContent = '⏸';
        } else if (state === 'covered') {
            const habitColor = habit?.color || '#2196F3';
            // Desaturate the habit color
            badgeStyle = [styles.dateBadge, { backgroundColor: habitColor + '20', borderColor: habitColor + '40' }];
            textStyle = [styles.dateText, { color: habitColor }];
            iconStyle = [styles.checkIcon, { backgroundColor: habitColor + '60' }];
            iconContent = '◐';
        }

        return (
            <TouchableOpacity
                key={dateStr}
                onPress={() => handleDayPress(dateStr, state)}
                disabled={state === 'paused'}
            >
                <View style={badgeStyle}>
                    <Text style={textStyle}>{formatDate(dateStr)}</Text>
                    <View style={iconStyle}>
                        <Text style={styles.checkmark}>{iconContent}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // Filter to only show relevant days
    const relevantDates = dates.filter(d => getDayState(d) !== null);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>History</Text>
            {relevantDates.length === 0 ? (
                <Text style={styles.emptyText}>No activity yet.</Text>
            ) : (
                <FlatList
                    data={relevantDates}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderDay}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    list: {
        paddingRight: 20,
    },
    dateBadge: {
        backgroundColor: '#E8F5E9',
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C8E6C9',
    },
    dateText: {
        fontSize: 12,
        color: '#2E7D32',
        fontWeight: '600',
        marginBottom: 4,
    },
    checkIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    pausedBadge: {
        backgroundColor: '#F5F5F5',
        borderColor: '#BDBDBD',
    },
    pausedText: {
        color: '#757575',
    },
    pausedIcon: {
        backgroundColor: '#9E9E9E',
    },
    emptyText: {
        color: '#999',
        fontStyle: 'italic',
    }
});

export default CompletedDaysView;
