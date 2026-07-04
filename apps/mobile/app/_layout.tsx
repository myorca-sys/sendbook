import { Stack } from "expo-router";
import { AuthProvider } from "../lib/auth";
import { QueryProvider } from "../lib/query-provider";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, LogBox } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { Theme } from "../lib/theme";
import { CustomSplashScreen } from "../components/ui/CustomSplashScreen";
import { useAppInitialization } from "../lib/hooks/useAppInitialization";

LogBox.ignoreLogs(["Unable to activate keep awake", "Uncaught (in promise, id: "]);

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { appReady, isWakingUp, activeTrivia } = useAppInitialization();

  return (
    <View style={styles.rootView}>
      {!appReady || isWakingUp ? (
        <CustomSplashScreen isWakingUp={isWakingUp} activeTrivia={activeTrivia} />
      ) : null}

      <QueryProvider>
        <AuthProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: Theme.colors.background },
              animation: "default",
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="explore" options={{ headerShown: false }} />
            <Stack.Screen name="trending" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }} />
            <Stack.Screen name="anime/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="manga/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="watch/[id]/[episode]" options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
      </QueryProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  rootView: { flex: 1, backgroundColor: Theme.colors.background },
});
