import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { useThemeColors } from "../hooks/useThemeColors";
import { useDatabaseMigrations } from "../db";
import { initI18n } from "../i18n";
import { seedPresets } from "../db/seedPresets";
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
      Promise.all([initI18n(), seedPresets()])
        .then(() => {
          setI18nReady(true);
          initAuth();
        })
        .catch((error) => {
          console.error("Initialization error:", error);
          setI18nReady(true); // Continue anyway
          initAuth();
        });
    }
  }, [migrationSuccess]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (authLoading || !migrationSuccess || !i18nReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to tabs if authenticated
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, authLoading, segments, migrationSuccess, i18nReady]);

  // Determine if we're still loading
  const isLoading = authLoading || !migrationSuccess || !i18nReady;

  // Build theme class names
  // CRITICAL: NO transition classes here - they cause Expo Router crashes on cold start
  const themeClasses = cn(
    "flex-1",
    activeTheme !== "default" ? `theme-${activeTheme}` : "",
    colorScheme === "dark" ? "dark" : "",
  );

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      {/* CRITICAL: Always render Stack immediately to establish navigation context.
          Never conditionally return a loading screen - this breaks Expo Router. */}
      <View
        className={themeClasses}
        style={{ backgroundColor: colors.background }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>

        {/* Loading overlay - shown on top of navigation, NOT instead of it */}
        {isLoading && (
          <View
            className="absolute inset-0 items-center justify-center"
            style={{
              backgroundColor: colors.background,
              zIndex: 9999,
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    </>
  );
}
