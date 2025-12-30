import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { useHabits } from '../context/HabitContext';
import HabitCard from '../components/HabitCard';
import AddHabitModal from '../components/AddHabitModal';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const HomeScreen = () => {
    const { habits, addHabit } = useHabits();
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const handleAddHabit = (habitData) => {
        addHabit(habitData);
    };

    const openDetail = (habit) => {
        navigation.navigate('HabitDetail', { habitId: habit.id });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <Text style={styles.title}>My Habits</Text>
            </View>

            <FlatList
                data={habits}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <HabitCard habit={item} onPress={() => openDetail(item)} />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No habits yet. Start by adding one!</Text>
                    </View>
                }
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
    list: {
        padding: 20,
        paddingBottom: 100,
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
