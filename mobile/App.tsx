import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Main from './src/navigation';
import { useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  const colorScheme = useColorScheme();

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Main colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
