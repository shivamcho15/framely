import React, { useState } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import FrequencySelector from './FrequencySelector';
import RemindersInput from './RemindersInput';

const AddHabitModal = ({ visible, onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState({ type: 'everyday', days: [] });
    const [reminders, setReminders] = useState([]);

    const handleSave = () => {
        if (!title.trim()) {
            alert('Please enter a habit title');
            return;
        }
        onAdd({
            title,
            description,
            frequency,
            reminders
        });
        // Reset form
        setTitle('');
        setDescription('');
        setFrequency({ type: 'everyday', days: [] });
        setReminders([]);
        onClose();
    };

    const handleCancel = () => {
        // Reset form
        setTitle('');
        setDescription('');
        setFrequency({ type: 'everyday', days: [] });
        setReminders([]);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.modalContent}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.header}>New Habit</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Habit Title (e.g., Drink Water)"
                            value={title}
                            onChangeText={setTitle}
                            autoFocus
                        />

                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Description (Optional)"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                        />

                        <FrequencySelector frequency={frequency} onChange={setFrequency} />
                        <RemindersInput reminders={reminders} onChange={setReminders} />

                        <View style={styles.buttons}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save Habit</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        height: '90%', // Increased height for more fields
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 40,
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        marginLeft: 10,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default AddHabitModal;
