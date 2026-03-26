import React from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { useThemeColors } from "../../hooks/useThemeColors";
import ScreenHeader from "../../components/ui/ScreenHeader";
import {
  wipeDatabaseAndSignOut,
  seedMockLogs,
} from "../../services/devService";

interface DevActionButtonProps {
  label: string;
  description: string;
  onPress: () => void;
  destructive?: boolean;
}

function DevActionButton({
  label,
  description,
  onPress,
  destructive = false,
}: DevActionButtonProps) {
  const colors = useThemeColors();
  return (
    <TouchableOpacity
      className="mb-3 rounded-xl p-4"
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: destructive ? (colors.error ?? "#ef4444") : colors.border,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        className="text-base font-semibold"
        style={{
          color: destructive ? (colors.error ?? "#ef4444") : colors.text,
        }}
      >
        {label}
      </Text>
      <Text className="mt-0.5 text-xs" style={{ color: colors.textSecondary }}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}

export default function DevToolsScreen() {
  const colors = useThemeColors();
  const { setDeveloperMode, logout, user } = useAuthStore();
  const router = useRouter();

  const handleResetDatabase = () => {
    Alert.alert(
      "⚠️ Reset Database",
      "This will permanently delete ALL user data, habits, and logs. The preset catalog will be restored. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Reset",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Final Confirmation",
              "There is no undo. All data will be gone. Continue?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Wipe Everything",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await wipeDatabaseAndSignOut(logout);
                      router.replace("/(auth)/login");
                    } catch (err) {
                      console.error("[DevTools] Reset failed:", err);
                      Alert.alert(
                        "Error",
                        "Database reset failed. Check the console for details.",
                      );
                    }
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  const handleAddMockLogs = async () => {
    if (!user) {
      Alert.alert("Not Signed In", "You must be signed in to seed mock logs.");
      return;
    }
    try {
      await seedMockLogs(user.id);
      Alert.alert("Done", "50 mock logs have been added across the last 30 days.");
    } catch (err: any) {
      if (err?.message === "NO_HABITS") {
        Alert.alert(
          "No Habits Found",
          "Create at least one habit before seeding mock logs.",
        );
      } else {
        console.error("[DevTools] seedMockLogs failed:", err);
        Alert.alert("Error", "Failed to seed mock logs. Check the console.");
      }
    }
  };

  const handleTestNotification = () => {
    Alert.alert(
      "Test Local Push Notification",
      "Notification test not yet implemented.",
      [{ text: "OK" }],
    );
  };

  const handleDisableDeveloperMode = () => {
    Alert.alert(
      "Disable Developer Mode",
      "The DevTools tab will be hidden until you unlock it again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disable",
          onPress: () => {
            setDeveloperMode(false);
            router.replace("/(tabs)/settings");
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title="DevTools" subtitle="Internal testing & debugging" />

      <ScrollView
        className="flex-1 px-6 py-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Warning banner */}
        <View
          className="mb-6 rounded-xl p-4"
          style={{
            backgroundColor: colors.error
              ? `${colors.error}1A`
              : "rgba(239,68,68,0.1)",
            borderWidth: 1,
            borderColor: colors.error ?? "#ef4444",
          }}
        >
          <Text
            className="text-sm font-semibold"
            style={{ color: colors.error ?? "#ef4444" }}
          >
            ⚠️ Developer Mode Active
          </Text>
          <Text
            className="mt-1 text-xs"
            style={{ color: colors.error ?? "#ef4444" }}
          >
            Actions here can permanently destroy data. Use with care.
          </Text>
        </View>

        {/* Placeholder actions */}
        <Text
          className="mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{ color: colors.textSecondary }}
        >
          Database
        </Text>
        <DevActionButton
          label="Reset Database"
          description="Drops and re-creates all tables. Irreversible."
          onPress={handleResetDatabase}
          destructive
        />

        <Text
          className="mb-3 mt-4 text-xs font-semibold uppercase tracking-widest"
          style={{ color: colors.textSecondary }}
        >
          Fixtures
        </Text>
        <DevActionButton
          label="Add 50 Mock Logs"
          description="Seeds habit logs across the last 30 days for testing."
          onPress={handleAddMockLogs}
        />

        <Text
          className="mb-3 mt-4 text-xs font-semibold uppercase tracking-widest"
          style={{ color: colors.textSecondary }}
        >
          Notifications
        </Text>
        <DevActionButton
          label="Test Local Push Notification"
          description="Fires a local notification immediately to verify the setup."
          onPress={handleTestNotification}
        />

        {/* Disable developer mode */}
        <TouchableOpacity
          className="mt-8 rounded-xl p-4"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          onPress={handleDisableDeveloperMode}
          activeOpacity={0.7}
        >
          <Text
            className="text-center text-base font-semibold"
            style={{ color: colors.textSecondary }}
          >
            Disable Developer Mode
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
