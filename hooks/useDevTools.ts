import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { startOfToday } from "date-fns";
import { useAuthStore } from "../store/authStore";
import { useDevLogStore } from "../store/devLogStore";
import { useToastStore } from "../store/toastStore";
import {
  wipeDatabaseAndSignOut,
  seedMockLogs,
  resetAllNotificationFlags,
} from "../services/devService";
import {
  generateMockHabits,
  generateMockLogs,
  wipeUserData,
  boostRPGStats,
  unlockAllSecretAchievements,
} from "../services/devGeneratorService";
import { getUserHabits } from "../services/habitService";
import { shouldShowHabit } from "../utils/habitScheduler";

export function useDevTools() {
  const { setDeveloperMode, logout, user, setFirstLaunch } = useAuthStore();
  const { clearLogs } = useDevLogStore();
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
                      setFirstLaunch(true);
                      router.replace("/(auth)/register");
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

  const handleWipeUserData = () => {
    if (!user) {
      Alert.alert("Not Signed In", "You must be signed in to wipe user data.");
      return;
    }
    Alert.alert(
      "⚠️ Wipe User Data",
      "This will permanently delete all habits, logs, and achievements for the current user. The account itself will remain. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Wipe My Data",
          style: "destructive",
          onPress: async () => {
            try {
              await wipeUserData(user.id);
              Alert.alert(
                "Done",
                "All habits, logs, and achievements have been wiped for this account.",
              );
            } catch (err) {
              console.error("[DevTools] wipeUserData failed:", err);
              Alert.alert(
                "Error",
                "Failed to wipe user data. Check the console.",
              );
            }
          },
        },
      ],
    );
  };

  const handleTestNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🧪 DevTools Test",
          body: "Push notifications are working perfectly!",
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
        },
      });
      Alert.alert(
        "Sent",
        "Notification scheduled in 2 seconds. Background the app to see it in the OS tray.",
      );
    } catch (err) {
      console.error("[DevTools] scheduleNotificationAsync failed:", err);
      Alert.alert(
        "Error",
        "Failed to schedule notification. Ensure notification permissions are granted.",
      );
    }
  };

  const handleInspectNotifications = async () => {
    const { addLog } = useDevLogStore.getState();
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      addLog("=== PUSH INSPECTOR ===");
      addLog(`Total scheduled: ${scheduled.length}`);
      scheduled.forEach((n) => {
        addLog(
          `[${n.identifier}] ${n.content.title ?? "(no title)"} — ${n.content.body ?? "(no body)"}`,
        );
      });
      Alert.alert(
        "Inspector",
        `Found ${scheduled.length} scheduled notification(s). Check the terminal for details.`,
      );
    } catch (err) {
      console.error(
        "[DevTools] getAllScheduledNotificationsAsync failed:",
        err,
      );
      Alert.alert(
        "Error",
        "Failed to inspect notifications. Check the console.",
      );
    }
  };

  const handleClearAllNotifications = async () => {
    if (!user) {
      Alert.alert(
        "Not Signed In",
        "You must be signed in to use this feature.",
      );
      return;
    }
    const { addLog } = useDevLogStore.getState();
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await resetAllNotificationFlags(user.id);
      addLog(
        "Cleared all OS-level scheduled notifications and reset DB flags.",
      );
      Alert.alert(
        "Done",
        "All scheduled notifications cancelled and DB notification state reset.",
      );
    } catch (err) {
      console.error("[DevTools] handleClearAllNotifications failed:", err);
      Alert.alert("Error", "Failed to clear notifications. Check the console.");
    }
  };

  const handleTestDeepLinkNotification = async () => {
    if (!user) {
      Alert.alert(
        "Not Signed In",
        "You must be signed in to use this feature.",
      );
      return;
    }
    try {
      const today = startOfToday();
      const allHabits = await getUserHabits(user.id);
      const todayHabits = allHabits.filter((h) => shouldShowHabit(h, today));

      if (todayHabits.length === 0) {
        Alert.alert(
          "No Habits Today",
          "No habits are scheduled for today. Add or generate some first.",
        );
        return;
      }

      const habit = todayHabits[Math.floor(Math.random() * todayHabits.length)];

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Test: ${habit.title}`,
          body: "Tap to open details",
          data: { habitId: habit.id },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
        },
      });

      Alert.alert(
        "Scheduled",
        `Deep-link notification for "${habit.title}" will fire in 5 seconds. Background the app, then tap it.`,
      );
    } catch (err) {
      console.error("[DevTools] handleTestDeepLinkNotification failed:", err);
      Alert.alert(
        "Error",
        "Failed to schedule deep-link notification. Check the console.",
      );
    }
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
            clearLogs();
            setDeveloperMode(false);
            router.replace("/(tabs)/settings");
          },
        },
      ],
    );
  };

  const handleTestToast = () => {
    useToastStore.getState().showToast({
      icon: "🏆",
      title: "Test Badge",
      description: "You did it!",
      tab: "badges",
    });
  };

  return {
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
  };
}
