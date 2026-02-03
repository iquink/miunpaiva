import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import { useAuthStore } from "../store/authStore";
import { useDatabaseMigrations } from "../db";
import React from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isLoading, isAuthenticated, initialize } = useAuthStore();
  const { success: migrationSuccess, error: migrationError } =
    useDatabaseMigrations();

  // Initialize database migrations
  useEffect(() => {
    if (migrationError) {
      console.error("Migration error:", migrationError);
    }
  }, [migrationError]);

  // Initialize auth on app start
  useEffect(() => {
    if (migrationSuccess) {
      initialize();
    }
  }, [migrationSuccess]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading || !migrationSuccess) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to tabs if authenticated
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments, migrationSuccess]);

  // Show loading screen while initializing
  if (isLoading || !migrationSuccess) {
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
