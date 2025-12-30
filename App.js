import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { HabitProvider } from './src/context/HabitContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <HabitProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </HabitProvider>
  );
}
