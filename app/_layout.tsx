import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import { useAuthStore } from "../store/authStore";
import { useDatabaseMigrations } from "../db";
import { initI18n } from "../i18n";
import { seedPresets } from "../db/seedPresets";
import React from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isLoading, isAuthenticated, initialize } = useAuthStore();
  const { success: migrationSuccess, error: migrationError } =
    useDatabaseMigrations();
  const [i18nReady, setI18nReady] = useState(false);

  // Initialize database migrations
  useEffect(() => {
    if (migrationError) {
      console.error("Migration error:", migrationError);
    }
  }, [migrationError]);

  // Initialize i18n and seed presets
  useEffect(() => {
    if (migrationSuccess) {
      Promise.all([initI18n(), seedPresets()])
        .then(() => {
          setI18nReady(true);
          initialize();
        })
        .catch((error) => {
          console.error("Initialization error:", error);
          setI18nReady(true); // Continue anyway
          initialize();
        });
    }
  }, [migrationSuccess]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading || !migrationSuccess || !i18nReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to tabs if authenticated
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments, migrationSuccess, i18nReady]);

  // Show loading screen while initializing
  if (isLoading || !migrationSuccess || !i18nReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
