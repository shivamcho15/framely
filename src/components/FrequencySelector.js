import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import WeekDaySelector from './WeekDaySelector';

const FrequencySelector = ({ frequency, onChange }) => {
    const { type, days } = frequency;

    const handleTypeChange = (newType) => {
        // If switching to specific and no days selected, default to today
        let newDays = days;
        if (newType === 'specific' && (!days || days.length === 0)) {
            newDays = [new Date().getDay()];
        }
        onChange({ ...frequency, type: newType, days: newDays });
    };

    const handleDaysChange = (newDays) => {
        onChange({ ...frequency, days: newDays });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, type === 'everyday' && styles.activeTab]}
                    onPress={() => handleTypeChange('everyday')}
                >
                    <Text style={[styles.tabText, type === 'everyday' && styles.activeTabText]}>Every Day</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, type === 'everyOtherDay' && styles.activeTab]}
                    onPress={() => handleTypeChange('everyOtherDay')}
                >
                    <Text style={[styles.tabText, type === 'everyOtherDay' && styles.activeTabText]}>Every Other Day</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, type === 'specific' && styles.activeTab]}
                    onPress={() => handleTypeChange('specific')}
                >
                    <Text style={[styles.tabText, type === 'specific' && styles.activeTabText]}>Specific Days</Text>
                </TouchableOpacity>
            </View>

            {type === 'specific' && (
                <View style={styles.specificContainer}>
                    <WeekDaySelector selectedDays={days || []} onChange={handleDaysChange} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    tabText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#007AFF',
        fontWeight: '600',
    },
    specificContainer: {
        marginTop: 10,
    }
});

export default FrequencySelector;
