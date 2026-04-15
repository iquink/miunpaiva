import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useDevLogStore } from "../../store/devLogStore";
import { useDevTools } from "../../hooks/useDevTools";
import ScreenHeader from "../../components/ui/ScreenHeader";
import DevActionButton from "../../components/devtools/DevActionButton";
import GeneratorCard from "../../components/devtools/GeneratorCard";
import DebugTerminal from "../../components/devtools/DebugTerminal";

export default function DevToolsScreen() {
  const colors = useThemeColors();
  const { logs, clearLogs } = useDevLogStore();
  const {
    habitCount,
    setHabitCount,
    logCount,
    setLogCount,
    handleResetDatabase,
    handleGenerateHabits,
    handleGenerateLogs,
    handleBoostRPGStats,
    handleUnlockAllSecretAchievements,
    handleWipeUserData,
    handleTestNotification,
    handleInspectNotifications,
    handleClearAllNotifications,
    handleTestDeepLinkNotification,
    handleDisableDeveloperMode,
    handleTestToast,
  } = useDevTools();

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
          Danger Zone
        </Text>
        <DevActionButton
          label="Wipe Current User Data"
          description="Deletes all habits, logs, and achievements for the signed-in user. Account stays intact."
          onPress={handleWipeUserData}
          destructive
        />

        <Text
          className="mb-3 mt-4 text-xs font-semibold uppercase tracking-widest"
          style={{ color: colors.textSecondary }}
        >
          Generators
        </Text>
        <GeneratorCard
          title="Generate Habits"
          description="Insert N random custom/preset habits for your account."
          inputValue={habitCount}
          onInputChange={setHabitCount}
          onGenerate={handleGenerateHabits}
        />
        <GeneratorCard
          title="Generate Logs (All Habits)"
          description="Insert N random completed logs spread across the last 30 days."
          inputValue={logCount}
          onInputChange={setLogCount}
          onGenerate={handleGenerateLogs}
        />

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
        <DevActionButton
          label="Inspect Scheduled Notifications"
          description="Dumps all OS-level scheduled pushes to the debug terminal."
          onPress={handleInspectNotifications}
        />
        <DevActionButton
          label="Clear ALL Scheduled Pushes"
          description="Nukes every pending notification in the OS queue. Use to clear ghosts."
          onPress={handleClearAllNotifications}
          destructive
        />
        <DevActionButton
          label="Test Deep Link Notification (5s)"
          description="Schedules a notification for a random today's habit with a 5-second delay."
          onPress={handleTestDeepLinkNotification}
        />

        <Text
          className="mb-3 mt-4 text-xs font-semibold uppercase tracking-widest"
          style={{ color: colors.textSecondary }}
        >
          Toast System
        </Text>
        <DevActionButton
          label="Test Global Toast"
          description="Fires a dummy badge toast to verify the global toast system."
          onPress={handleTestToast}
        />

        <DebugTerminal logs={logs} onClear={clearLogs} />

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
