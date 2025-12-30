import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StreakBadge = ({ streak }) => {
    if (streak === 0) return null;

    return (
        <View style={styles.badge}>
            <Text style={styles.icon}>🔥</Text>
            <Text style={styles.text}>{streak}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0E6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFDDC1',
    },
    icon: {
        fontSize: 14,
        marginRight: 4,
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF6B00',
    },
});

export default StreakBadge;
