import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import VisualizationScreen from '../screens/VisualizationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                }
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    title: 'Habits',
                    tabBarLabel: 'Habits',
                }}
            />
            <Tab.Screen
                name="Visualization"
                component={VisualizationScreen}
                options={{
                    title: 'Progress',
                    tabBarLabel: 'Progress',
                }}
            />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Main"
                component={TabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="HabitDetail"
                component={HabitDetailScreen}
                options={{ title: 'Habit Details' }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
