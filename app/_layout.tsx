import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context"; // Import this!

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../i18n/i18n";
import Header from "@/components/layout/Header";
import { GlobalProvider } from "./ContextProvider";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const queryClient = new QueryClient();

  if (!loaded) {
    return null;
  }

  return (
    <GlobalProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <Header />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GlobalProvider>
  );
}
