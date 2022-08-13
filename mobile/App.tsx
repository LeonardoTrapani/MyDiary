import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Main from './src/navigation';
import { useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const App = () => {
  const colorScheme = useColorScheme();

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Main colorScheme={colorScheme} />
      <StatusBar />
    </QueryClientProvider>
  );
};

export default App;
