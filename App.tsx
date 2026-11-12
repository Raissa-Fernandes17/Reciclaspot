import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ReciclaProvider } from './src/hooks/useReciclaContext';

export default function App() {
  return (
    <ReciclaProvider>
      <StatusBar style="light" backgroundColor="#046A38" />
      <AppNavigator />
    </ReciclaProvider>
  );
}
