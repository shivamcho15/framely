import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, TextInput, Modal } from 'react-native';

const RemindersInput = ({ reminders, onChange, onChangeEnabled }) => {
    const enabled = reminders && reminders.length > 0;
    const [modalVisible, setModalVisible] = useState(false);
    const [tempTime, setTempTime] = useState('');

    const handleToggle = () => {
        if (enabled) {
            onChange([]); // Clear reminders to disable
        } else {
            onChange(['09:00']); // Add default to enable
        }
    };

    const addReminder = () => {
        setTempTime('');
        setModalVisible(true);
    };

    const saveReminder = () => {
        // Simple validation H:MM or HH:MM
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (timeRegex.test(tempTime)) {
            // Pad with leading zero if needed 9:00 -> 09:00
            const formatted = tempTime.length === 4 ? `0${tempTime}` : tempTime;
            onChange([...reminders, formatted].sort());
            setModalVisible(false);
        } else {
            alert('Invalid format. Use HH:MM (24h)');
        }
    };

    const removeReminder = (timeToRemove) => {
        onChange(reminders.filter(t => t !== timeToRemove));
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
                        <Text style={styles.modalTitle}>Enter Time</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="HH:MM (e.g. 14:30)"
                            value={tempTime}
                            onChangeText={setTempTime}
                            keyboardType="numbers-and-punctuation"
                            autoFocus
                            maxLength={5}
                        />
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
        width: '80%',
        maxWidth: 300,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
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
