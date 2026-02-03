import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { eq } from "drizzle-orm";
import { LogOut, Trash2, User } from "lucide-react-native";
import { useAuthStore } from "../../store/authStore";
import { db } from "../../db";
import {
  users,
  habits,
  logs,
  achievements,
  userAchievements,
} from "../../db/schema";
import React from "react";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all associated data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!user) return;

            setIsDeleting(true);
            try {
              // Delete all user data (cascade will handle related tables)
              await db.delete(users).where(eq(users.id, user.id));

              // Logout and redirect
              await logout();
              router.replace("/(auth)/login");

              Alert.alert("Success", "Account deleted successfully");
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert("Error", "Failed to delete account");
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-500">No user logged in</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pb-4 pt-12">
        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
        <Text className="mt-1 text-gray-600">Manage your account</Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* User Info Section */}
        <View className="mb-6 rounded-xl bg-white p-4">
          <Text className="mb-3 text-sm font-semibold uppercase text-gray-500">
            Account Info
          </Text>

          <View className="flex-row items-center">
            <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <User color="#3b82f6" size={24} />
            </View>
            <View>
              <Text className="text-base font-semibold text-gray-900">
                {user.username}
              </Text>
              <Text className="text-sm text-gray-500">User ID: {user.id}</Text>
            </View>
          </View>

          {user.createdAt && (
            <View className="mt-3 rounded-lg bg-gray-50 p-3">
              <Text className="text-xs text-gray-600">
                Member since: {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {/* Actions Section */}
        <View className="mb-6 rounded-xl bg-white p-4">
          <Text className="mb-3 text-sm font-semibold uppercase text-gray-500">
            Actions
          </Text>

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center rounded-lg bg-gray-100 p-4"
          >
            <LogOut color="#6b7280" size={20} />
            <Text className="ml-3 text-base font-semibold text-gray-700">
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View className="mb-6 rounded-xl border border-red-200 bg-white p-4">
          <Text className="mb-3 text-sm font-semibold uppercase text-red-600">
            Danger Zone
          </Text>

          <TouchableOpacity
            onPress={handleDeleteAccount}
            disabled={isDeleting}
            className={`flex-row items-center rounded-lg p-4 ${
              isDeleting ? "bg-red-200" : "bg-red-100"
            }`}
          >
            <Trash2 color="#dc2626" size={20} />
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-red-600">
                {isDeleting ? "Deleting..." : "Delete Account"}
              </Text>
              <Text className="mt-1 text-xs text-red-500">
                Permanently delete your account and all data
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="mt-8 items-center">
          <Text className="text-xs text-gray-400">Habit Tracker v1.0.0</Text>
          <Text className="mt-1 text-xs text-gray-400">
            Made with ❤️ using React Native & Expo
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
