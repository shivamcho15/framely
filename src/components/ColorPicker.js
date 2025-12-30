import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../utils/colors';

const ColorPicker = ({ selectedColor, onSelect }) => {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            {COLORS.map((color) => {
                const isSelected = selectedColor === color;
                return (
                    <TouchableOpacity
                        key={color}
                        style={[
                            styles.colorCircle,
                            { backgroundColor: color },
                            isSelected && styles.selectedCircle
                        ]}
                        onPress={() => onSelect(color)}
                    >
                        {isSelected && <View style={styles.innerDot} />}
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        marginBottom: 16,
    },
    colorCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedCircle: {
        borderColor: '#333',
    },
    innerDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#fff',
    }
});

export default ColorPicker;
