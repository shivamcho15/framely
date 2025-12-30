import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const RemindersInput = ({ reminders, onChange }) => {
    const enabled = reminders && reminders.length > 0;
    const [modalVisible, setModalVisible] = useState(false);
    const [tempDate, setTempDate] = useState(new Date());

    const handleToggle = () => {
        if (enabled) {
            onChange([]); // Clear reminders to disable
        } else {
            onChange(['09:00']); // Add default to enable
        }
    };

    const addReminder = () => {
        // Default to 9:00 AM or current time
        const now = new Date();
        now.setHours(9, 0, 0, 0);
        setTempDate(now);
        setModalVisible(true);
    };

    const saveReminder = () => {
        const hours = tempDate.getHours().toString().padStart(2, '0');
        const minutes = tempDate.getMinutes().toString().padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;

        // Avoid duplicates
        if (!reminders.includes(timeStr)) {
            onChange([...reminders, timeStr].sort());
        }
        setModalVisible(false);
    };

    const removeReminder = (timeToRemove) => {
        onChange(reminders.filter(t => t !== timeToRemove));
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || tempDate;
        setTempDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>Reminders</Text>
                <TouchableOpacity onPress={handleToggle}>
                    <Text style={[styles.toggleText, enabled ? styles.on : styles.off]}>
                        {enabled ? 'ON' : 'OFF'}
                    </Text>
                </TouchableOpacity>
            </View>

            {enabled && (
                <View style={styles.list}>
                    {reminders.map((time, index) => (
                        <View key={index} style={styles.timeBadge}>
                            <Text style={styles.timeText}>{time}</Text>
                            <TouchableOpacity onPress={() => removeReminder(time)} hitSlop={10}>
                                <Text style={styles.removeText}>×</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.addButton} onPress={addReminder}>
                        <Text style={styles.addText}>+ Add Time</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Select Time</Text>

                        <View style={styles.pickerContainer}>
                            <DateTimePicker
                                value={tempDate}
                                mode="time"
                                display="spinner" // iOS wheel style
                                onChange={onDateChange}
                                style={styles.picker}
                                themeVariant="light"
                                textColor="#000000"
                            />
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalBtn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalBtn, styles.primaryBtn]} onPress={saveReminder}>
                                <Text style={[styles.btnText, styles.primaryText]}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    toggleText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    on: { color: '#007AFF' },
    off: { color: '#999' },
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    timeText: {
        color: '#1565C0',
        fontWeight: '600',
        marginRight: 6,
    },
    removeText: {
        color: '#1565C0',
        fontSize: 18,
        lineHeight: 18,
    },
    addButton: {
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        justifyContent: 'center',
    },
    addText: {
        color: '#007AFF',
        fontSize: 12,
        fontWeight: '600',
    },
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        width: '85%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    pickerContainer: {
        height: 150,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    picker: {
        width: '100%',
        height: 150,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    modalBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    primaryBtn: {
        backgroundColor: '#007AFF',
    },
    btnText: {
        fontWeight: '600',
        color: '#333',
    },
    primaryText: {
        color: '#fff',
    }
});

export default RemindersInput;
