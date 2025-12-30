import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const CompletedDaysView = ({ completedDates }) => {
    // Sort dates descending
    const sortedDates = [...(completedDates || [])].sort((a, b) => new Date(b) - new Date(a));

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>History</Text>
            {sortedDates.length === 0 ? (
                <Text style={styles.emptyText}>No days completed yet.</Text>
            ) : (
                <FlatList
                    data={sortedDates}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.dateBadge}>
                            <Text style={styles.dateText}>{formatDate(item)}</Text>
                            <View style={styles.checkIcon}>
                                <Text style={styles.checkmark}>✓</Text>
                            </View>
                        </View>
                    )}
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
    emptyText: {
        color: '#999',
        fontStyle: 'italic',
    }
});

export default CompletedDaysView;
