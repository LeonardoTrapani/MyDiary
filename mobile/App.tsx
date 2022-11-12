import React from "react";
import { useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Main from "./src/navigation";

const App = () => {
  const colorScheme = useColorScheme();

  const queryClient = new QueryClient();

  console.log("rendering");
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Main colorScheme={colorScheme} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
