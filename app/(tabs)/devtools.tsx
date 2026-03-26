import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { useThemeColors } from "../../hooks/useThemeColors";
import ScreenHeader from "../../components/ui/ScreenHeader";
import {
  wipeDatabaseAndSignOut,
  seedMockLogs,
} from "../../services/devService";
import {
  generateMockHabits,
  generateMockLogs,
  boostRPGStats,
  unlockAllSecretAchievements,
} from "../../services/devGeneratorService";

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
  const [habitCount, setHabitCount] = useState("5");
  const [logCount, setLogCount] = useState("50");

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
      Alert.alert(
        "Done",
        "50 mock logs have been added across the last 30 days.",
      );
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

  const handleGenerateHabits = async () => {
    if (!user) {
      Alert.alert("Not Signed In", "You must be signed in to generate habits.");
      return;
    }
    const count = parseInt(habitCount, 10);
    if (isNaN(count) || count < 1) {
      Alert.alert(
        "Invalid Count",
        "Enter a positive number of habits to generate.",
      );
      return;
    }
    try {
      await generateMockHabits(user.id, count);
      Alert.alert("Done", `${count} mock habit(s) generated successfully.`);
    } catch (err) {
      console.error("[DevTools] generateMockHabits failed:", err);
      Alert.alert("Error", "Failed to generate habits. Check the console.");
    }
  };

  const handleGenerateLogs = async () => {
    if (!user) {
      Alert.alert("Not Signed In", "You must be signed in to generate logs.");
      return;
    }
    const count = parseInt(logCount, 10);
    if (isNaN(count) || count < 1) {
      Alert.alert(
        "Invalid Count",
        "Enter a positive number of logs to generate.",
      );
      return;
    }
    try {
      await generateMockLogs(user.id, count);
      Alert.alert("Done", `${count} mock log(s) generated across all habits.`);
    } catch (err: any) {
      if (err?.message === "NO_HABITS") {
        Alert.alert(
          "No Habits Found",
          "Create or generate at least one habit before generating logs.",
        );
      } else {
        console.error("[DevTools] generateMockLogs failed:", err);
        Alert.alert("Error", "Failed to generate logs. Check the console.");
      }
    }
  };

  const handleBoostRPGStats = async () => {
    if (!user) {
      Alert.alert(
        "Not Signed In",
        "You must be signed in to use this feature.",
      );
      return;
    }
    try {
      await boostRPGStats(user.id);
      Alert.alert(
        "Done",
        "7 category habits created with 50 completions each. RPG stats will update on next app load.",
      );
    } catch (err) {
      console.error("[DevTools] boostRPGStats failed:", err);
      Alert.alert("Error", "Failed to boost RPG stats. Check the console.");
    }
  };

  const handleUnlockAllSecretAchievements = async () => {
    if (!user) {
      Alert.alert(
        "Not Signed In",
        "You must be signed in to use this feature.",
      );
      return;
    }
    try {
      await unlockAllSecretAchievements(user.id);
      Alert.alert("Done", "All secret achievements have been unlocked.");
    } catch (err) {
      console.error("[DevTools] unlockAllSecretAchievements failed:", err);
      Alert.alert(
        "Error",
        "Failed to unlock secret achievements. Check the console.",
      );
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
          Generators
        </Text>

        {/* Generate Habits */}
        <View
          className="mb-3 rounded-xl p-4"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            className="mb-2 text-base font-semibold"
            style={{ color: colors.text }}
          >
            Generate Habits
          </Text>
          <Text
            className="mb-3 text-xs"
            style={{ color: colors.textSecondary }}
          >
            Insert N random custom/preset habits for your account.
          </Text>
          <View className="flex-row items-center gap-2">
            <TextInput
              value={habitCount}
              onChangeText={setHabitCount}
              keyboardType="number-pad"
              maxLength={4}
              className="mr-2 flex-1 rounded-lg px-3 py-2 text-base"
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
                color: colors.text,
              }}
              selectTextOnFocus
            />
            <TouchableOpacity
              className="rounded-lg px-4 py-2"
              style={{ backgroundColor: colors.primary ?? "#6366f1" }}
              onPress={handleGenerateHabits}
              activeOpacity={0.7}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: "#ffffff" }}
              >
                Generate
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Generate Logs */}
        <View
          className="mb-3 rounded-xl p-4"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            className="mb-2 text-base font-semibold"
            style={{ color: colors.text }}
          >
            Generate Logs (All Habits)
          </Text>
          <Text
            className="mb-3 text-xs"
            style={{ color: colors.textSecondary }}
          >
            Insert N random completed logs spread across the last 30 days.
          </Text>
          <View className="flex-row items-center gap-2">
            <TextInput
              value={logCount}
              onChangeText={setLogCount}
              keyboardType="number-pad"
              maxLength={5}
              className="mr-2 flex-1 rounded-lg px-3 py-2 text-base"
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
                color: colors.text,
              }}
              selectTextOnFocus
            />
            <TouchableOpacity
              className="rounded-lg px-4 py-2"
              style={{ backgroundColor: colors.primary ?? "#6366f1" }}
              onPress={handleGenerateLogs}
              activeOpacity={0.7}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: "#ffffff" }}
              >
                Generate
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text
          className="mb-3 mt-4 text-xs font-semibold uppercase tracking-widest"
          style={{ color: colors.textSecondary }}
        >
          RPG &amp; Progression
        </Text>
        <DevActionButton
          label="Boost All RPG Levels"
          description="Adds habits and injects 50 completions per category to trigger level-ups."
          onPress={handleBoostRPGStats}
        />
        <DevActionButton
          label="Unlock All Secret Badges"
          description="Instantly unlocks every secret achievement in the catalog."
          onPress={handleUnlockAllSecretAchievements}
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
