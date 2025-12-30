import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useHabits } from '../context/HabitContext';
import StreakBadge from '../components/StreakBadge';
import CompletedDaysView from '../components/CompletedDaysView';
import FrequencySelector from '../components/FrequencySelector';
import RemindersInput from '../components/RemindersInput';
import ColorPicker from '../components/ColorPicker';
import { getLocalDateString } from '../utils/dates';
import { COLORS } from '../utils/colors';


const HabitDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { habits, removeHabit, updateHabit, toggleHabitCompletion, getStreak, getHabitCompletionDates } = useHabits();
    const { habitId } = route.params;

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState({ type: 'everyday', days: [] });
    const [reminders, setReminders] = useState([]);
    const [color, setColor] = useState(COLORS[0]);

    const habit = habits.find((h) => h.id === habitId);

    // Get live data
    const completionDates = habit ? getHabitCompletionDates(habit.id) : [];

    useEffect(() => {
        if (habit) {
            setTitle(habit.title);
            setDescription(habit.description || '');
            setFrequency(habit.frequency || { type: 'everyday', days: [] });
            setReminders(habit.reminders || []);
            setColor(habit.color || COLORS[0]);
        }
    }, [habit]);

    if (!habit) {
        return (
            <View style={styles.center}>
                <Text>Habit not found</Text>
            </View>
        );
    }

    const handleDelete = () => {
        Alert.alert(
            'Delete Habit',
            'Are you sure you want to delete this habit?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        removeHabit(habitId);
                        navigation.goBack();
                    }
                },
            ]
        );
    };

    const handleSave = () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Title cannot be empty');
            return;
        }
        updateHabit(habitId, { title, description, frequency, reminders, color });
        setIsEditing(false);
    };

    const streak = getStreak(habit);
    const today = new Date();
    const todayStr = getLocalDateString(today);
    const isCompletedToday = completionDates.includes(todayStr);

    const handleToggleToday = () => {
        toggleHabitCompletion(habit.id, todayStr);
    };

    const renderFrequencyText = () => {
        const f = habit.frequency || { type: 'everyday', days: [] };
        if (f.type === 'everyday') return 'Every Day';
        if (f.type === 'everyOtherDay') return 'Every Other Day';
        if (f.type === 'specific') {
            const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return f.days.sort().map(d => daysMap[d]).join(', ');
        }
        return '';
    };

    const renderRemindersText = () => {
        const r = habit.reminders;
        if (!r || r.length === 0) return 'No reminders set';
        return r.join(', ');
    };

    const accentColor = habit.color || COLORS[0];

    return (
        <View style={styles.container}>
            {/* Accent Header Line */}
            <View style={{ height: 6, backgroundColor: accentColor }} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {isEditing ? (
                    <View>
                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                        />

                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                        />

                        <FrequencySelector frequency={frequency} onChange={setFrequency} />

                        <RemindersInput reminders={reminders} onChange={setReminders} />

                        <Text style={styles.label}>Color</Text>
                        <ColorPicker selectedColor={color} onSelect={setColor} />

                        <View style={{ height: 20 }} />
                    </View>
                ) : (
                    <View>
                        <View style={styles.header}>
                            <Text style={[styles.title, { color: accentColor }]}>{habit.title}</Text>
                            <StreakBadge streak={streak} />
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.mainCheckButton,
                                isCompletedToday && { backgroundColor: accentColor + '20', borderColor: accentColor }
                            ]}
                            onPress={handleToggleToday}
                        >
                            <Text style={[
                                styles.mainCheckText,
                                isCompletedToday && { color: accentColor, fontWeight: 'bold' }
                            ]}>
                                {isCompletedToday ? "Completed Today!" : "Mark as Done Today"}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.infoSection}>
                            <Text style={styles.infoLabel}>Frequency:</Text>
                            <Text style={styles.infoValue}>{renderFrequencyText()}</Text>
                        </View>

                        <View style={styles.infoSection}>
                            <Text style={styles.infoLabel}>Reminders:</Text>
                            <Text style={styles.infoValue}>{renderRemindersText()}</Text>
                        </View>


                        {habit.description ? (
                            <Text style={styles.description}>{habit.description}</Text>
                        ) : (
                            <Text style={[styles.description, { fontStyle: 'italic', color: '#999' }]}>No description provided</Text>
                        )}

                        <CompletedDaysView completedDates={completionDates} />
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                {isEditing ? (
                    <TouchableOpacity style={[styles.button, { backgroundColor: accentColor }]} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save Changes</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setIsEditing(true)}>
                        <Text style={[styles.buttonText, { color: accentColor }]}>Edit Habit</Text>
                    </TouchableOpacity>
                )}

                {isEditing ? (
                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsEditing(false)}>
                        <Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                        <Text style={[styles.buttonText, { color: '#FF3B30' }]}>Delete Habit</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
        marginBottom: 20,
        marginTop: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    mainCheckButton: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#eee',
    },
    mainCheckText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
    },
    infoSection: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    infoLabel: {
        fontWeight: '600',
        color: '#666',
        marginRight: 8,
        width: 80,
    },
    infoValue: {
        color: '#333',
        flex: 1,
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    editButton: {
        backgroundColor: '#f9f9f9',
    },
    deleteButton: {
        backgroundColor: '#fff0f0',
    },
    cancelButton: {
        backgroundColor: '#eee',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    }
});

export default HabitDetailScreen;
