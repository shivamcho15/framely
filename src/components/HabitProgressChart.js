import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { isScheduled, getLocalDateString } from '../utils/streak';

const HabitProgressChart = ({ habit }) => {
    const { completedDates, frequency } = habit;
    const WEEKS_TO_SHOW = 4;
    const today = new Date();

    // Calculate start date aligned to Sunday
    // If today is Tuesday (Day 2), we go back (WEEKS_TO_SHOW-1) full weeks + 2 days? 
    // Easier: Go back 3 weeks (21 days) from last Sunday.
    const dayOfWeek = today.getDay(); // 0-6 Sun-Sat
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - dayOfWeek);

    const startOfChart = new Date(startOfCurrentWeek);
    startOfChart.setDate(startOfChart.getDate() - ((WEEKS_TO_SHOW - 1) * 7));

    // Generate all days from startOfChart -> Today
    const days = [];
    const current = new Date(startOfChart);
    const end = new Date(today);

    // Normalize time to compare dates safely
    current.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Loop until we pass today
    while (current <= end) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    const renderCell = (date) => {
        const dateStr = getLocalDateString(date);
        const completed = completedDates && completedDates.includes(dateStr);
        const scheduled = isScheduled(date, frequency);

        const todayStr = getLocalDateString(new Date());
        const isPast = dateStr < todayStr;
        const isToday = dateStr === todayStr;

        let backgroundColor = '#f0f0f0'; // Default Gray (Not Scheduled / Future)

        if (scheduled) {
            if (completed) {
                backgroundColor = '#4CAF50'; // Done (Accent Color)
            } else {
                if (isPast) {
                    backgroundColor = '#FFAB91'; // Light Red/Orange (Missed)
                } else if (isToday) {
                    backgroundColor = '#E0E0E0'; // Light Gray (Pending Today)
                }
            }
        }

        return (
            <View key={dateStr} style={[styles.cell, { backgroundColor }]} />
        );
    };

    // Organize into weeks (rows of 7)
    const weeks = [];
    let currentWeek = [];
    days.forEach((day, index) => {
        currentWeek.push(day);
        // If we hit Saturday (end of week) OR it's the very last day (Today)
        if (day.getDay() === 6 || index === days.length - 1) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    const headers = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Last 4 Weeks</Text>

            {/* Header Row */}
            <View style={styles.row}>
                {headers.map((h, i) => (
                    <View key={i} style={styles.headerCell}>
                        <Text style={styles.headerText}>{h}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.gridContainer}>
                {weeks.map((week, weekIndex) => (
                    <View key={weekIndex} style={styles.row}>
                        {week.map(renderCell)}
                        {/* Fill remaining cells if last row is incomplete and we want 7 columns alignment?
                      Style `justifyContent: 'flex-start'` plus fixed width cells handles this automatically 
                      as long as we don't use 'space-between'. 
                      Wait, previous style used 'space-between'.
                      We need to switch to 'flex-start' and gaps to keep alignment if row is short.
                   */}
                    </View>
                ))}
            </View>

            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.cell, { backgroundColor: '#4CAF50', width: 16, height: 16 }]} />
                    <Text style={styles.legendText}>Done</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.cell, { backgroundColor: '#FFAB91', width: 16, height: 16 }]} />
                    <Text style={styles.legendText}>Missed</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.cell, { backgroundColor: '#f0f0f0', width: 16, height: 16 }]} />
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
    gridContainer: {
        gap: 4,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
        gap: 4, // Use gap for spacing
        // justifyContent: 'flex-start', // Default
    },
    headerCell: {
        width: '12%',
        alignItems: 'center',
        marginBottom: 4,
    },
    headerText: {
        fontSize: 10,
        color: '#999',
        fontWeight: 'bold',
    },
    cell: {
        width: '12%',
        aspectRatio: 1,
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
