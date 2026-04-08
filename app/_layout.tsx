import { useEffect, useRef, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import "../global.css";

// Keep the native splash screen visible until the app is fully ready.
SplashScreen.preventAutoHideAsync();
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { useThemeColors } from "../hooks/useThemeColors";
import { useDatabaseMigrations, db } from "../db";
import { initI18n } from "../i18n";
import { seedPresets } from "../db/seedPresets";
import { migrateOldPresets } from "../utils/presetMigration";
import { cn } from "../lib/utils";
import React from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const colorScheme = useColorScheme();

  // State management
  const {
    isLoading: authLoading,
    isAuthenticated,
    isFirstLaunch,
    initialize: initAuth,
  } = useAuthStore();
  const { activeTheme, initialize: initTheme } = useThemeStore();
  const colors = useThemeColors();

  // Database and i18n state
  const { success: migrationSuccess, error: migrationError } =
    useDatabaseMigrations();
  const [i18nReady, setI18nReady] = useState(false);

  // Initialize database migrations
  useEffect(() => {
    if (migrationError) {
      console.error("Migration error:", migrationError);
    }
  }, [migrationError]);

  // Initialize theme store
  useEffect(() => {
    initTheme();
  }, []);

  // Initialize i18n and seed presets
  useEffect(() => {
    if (migrationSuccess) {
      (async () => {
        try {
          console.log("[init] Running data migration...");
          await migrateOldPresets(db);
          console.log("[init] Data migration complete.");
          await Promise.all([initI18n(), seedPresets()]);
          setI18nReady(true);
          initAuth();
        } catch (error) {
          console.error("Initialization error:", error);
          setI18nReady(true); // Continue anyway
          initAuth();
        }
      })();
    }
  }, [migrationSuccess]);

  // Hide the splash screen once i18n, migrations, and auth are all ready.
  const appIsReady = !authLoading && !!migrationSuccess && i18nReady;
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (authLoading || !migrationSuccess || !i18nReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isAuthenticated && inAuthGroup) {
      // Redirect to tabs if authenticated
      router.replace("/(tabs)");
    } else if (!isAuthenticated && !inAuthGroup) {
      // Fresh install with no users -> go straight to register
      if (isFirstLaunch) {
        router.replace("/(auth)/register");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [
    isAuthenticated,
    isFirstLaunch,
    authLoading,
    segments,
    migrationSuccess,
    i18nReady,
  ]);

  // Deep-link from notification taps: navigate to the Tasks tab and open the
  // Habit Details Modal for the tapped habit.
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const habitId = response.notification.request.content.data?.habitId;
        if (habitId != null) {
          router.push(`/(tabs)/tasks?openModalId=${habitId}`);
        }
      },
    );
    return () => subscription.remove();
  }, [router]);

  // While not ready, return null — the native splash screen remains visible.
  if (!appIsReady) {
    return null;
  }

  // Build theme class names
  // CRITICAL: NO transition classes here - they cause Expo Router crashes on cold start
  const themeClasses = cn(
    "flex-1",
    activeTheme !== "default" ? `theme-${activeTheme}` : "",
    colorScheme === "dark" ? "dark" : "",
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <View
        className={themeClasses}
        style={{ backgroundColor: colors.background }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </GestureHandlerRootView>
  );
}
