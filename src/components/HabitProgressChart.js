import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { isScheduled } from '../utils/streak';

const HabitProgressChart = ({ habit }) => {
    const { completedDates, frequency } = habit;
    const daysToShow = 28; // 4 weeks
    const today = new Date();

    // Create array of last 28 days
    const dayCells = [];
    for (let i = daysToShow - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        dayCells.push(d);
    }

    const renderCell = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        const isToday = dateStr === new Date().toISOString().split('T')[0];
        const completed = completedDates && completedDates.includes(dateStr);
        const scheduled = isScheduled(date, frequency);

        let backgroundColor = '#f0f0f0'; // Default Gray (Not Scheduled)

        if (scheduled) {
            if (completed) {
                backgroundColor = '#4CAF50'; // Green (Done)
            } else {
                // Not done
                if (new Date(dateStr) < new Date(new Date().toISOString().split('T')[0])) {
                    // Past and missed
                    backgroundColor = '#FFAB91'; // Light Red/Orange (Missed)
                } else {
                    // Today or future
                    backgroundColor = '#E0E0E0'; // Light Gray (Pending)
                }
            }
        }

        return (
            <View key={dateStr} style={[styles.cell, { backgroundColor }]} />
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Last 4 Weeks</Text>
            <View style={styles.grid}>
                {dayCells.map(renderCell)}
            </View>

            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.cell, { backgroundColor: '#4CAF50' }]} />
                    <Text style={styles.legendText}>Done</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.cell, { backgroundColor: '#FFAB91' }]} />
                    <Text style={styles.legendText}>Missed</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.cell, { backgroundColor: '#f0f0f0' }]} />
                    <Text style={styles.legendText}>Rest</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
        color: '#666',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        justifyContent: 'flex-start',
    },
    cell: {
        width: 20,
        height: 20,
        borderRadius: 4,
    },
    legend: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendText: {
        fontSize: 12,
        color: '#666',
    }
});

export default HabitProgressChart;
