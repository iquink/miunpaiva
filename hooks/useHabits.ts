import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import type { Habit, Log, PresetCategory, PresetItem } from "../db/schema";
import {
  getUserHabits,
  getLogsForDate,
  createHabit,
  toggleBooleanHabitLog,
  updateCounterHabitLog,
  deleteHabit as deleteHabitService,
  updateHabitNotification,
  getPresetCategories,
  getPresetItems,
} from "../services/habitService";
import {
  requestPermissionsAsync,
  scheduleHabitNotification,
  cancelHabitNotification,
} from "../services/notificationService";
import { shouldShowHabit } from "../utils/habitScheduler";

/**
 * Custom hook for managing habits state and operations
 */
export function useHabits(userId: number | undefined, selectedDate: Date) {
  const { t } = useTranslation("common");
  const [userHabits, setUserHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<Map<number, Log>>(new Map());
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<PresetCategory[]>([]);
  const [presets, setPresets] = useState<PresetItem[]>([]);

  const dateStr = format(selectedDate, "yyyy-MM-dd");

  // Load habits and logs
  const loadHabits = useCallback(async () => {
    if (!userId) return;

    try {
      const fetchedHabits = await getUserHabits(userId);
      const visibleHabits = fetchedHabits.filter((habit) =>
        shouldShowHabit(habit, selectedDate),
      );

      setUserHabits((prev) => {
        const isSame =
          prev.length === visibleHabits.length &&
          prev.every(
            (h, i) => JSON.stringify(h) === JSON.stringify(visibleHabits[i]),
          );
        return isSame ? prev : visibleHabits;
      });

      const habitIds = visibleHabits.map((h) => h.id);
      const logsMap = await getLogsForDate(habitIds, dateStr);

      setHabitLogs((prev) => {
        if (prev.size !== logsMap.size) return logsMap;

        let isSame = true;
        for (const [key, value] of prev) {
          if (logsMap.get(key)?.id !== value.id) {
            isSame = false;
            break;
          }
        }
        return isSame ? prev : logsMap;
      });
    } catch (error) {
      console.error("Error loading habits:", error);
      Alert.alert(t("error"), t("error_load_habits"));
    }
  }, [userId, dateStr, selectedDate]);

  // Load preset categories and items
  const loadPresets = useCallback(async () => {
    try {
      const fetchedCategories = await getPresetCategories();
      setCategories(fetchedCategories);

      const fetchedPresets = await getPresetItems();
      setPresets(fetchedPresets);
    } catch (error) {
      console.error("Error loading presets:", error);
    }
  }, []);

  useEffect(() => {
    loadHabits();
    loadPresets();
  }, [loadHabits, loadPresets]);

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  // Add a new habit
  const handleAddHabit = async (habitData: {
    title: string;
    description: string;
    unit: string;
    dailyGoal: string;
    category: string | null;
    selectedPreset: string | null;
    frequency: "daily" | "weekly" | "once";
    selectedWeekdays: number[];
    targetDate: Date | null;
    endDate: Date | null;
    timeOfDay: "morning" | "late_morning" | "afternoon" | "evening" | "all_day";
    enableReminder: boolean;
  }) => {
    if (!userId || !habitData.title.trim()) {
      Alert.alert(t("error"), t("error_title_required"));
      return false;
    }

    // Validate schedule fields
    if (habitData.frequency === "once" && !habitData.targetDate) {
      Alert.alert(
        t("error"),
        "Please select a target date for one-time habits",
      );
      return false;
    }

    if (
      habitData.frequency === "weekly" &&
      habitData.selectedWeekdays.length === 0
    ) {
      Alert.alert(t("error"), "Please select at least one weekday");
      return false;
    }

    try {
      // Auto-detect type based on unit/goal
      const hasUnit = habitData.unit.trim().length > 0;
      const hasGoal = habitData.dailyGoal.trim().length > 0;
      const habitType: "boolean" | "counter" =
        hasUnit || hasGoal ? "counter" : "boolean";

      const newHabit = await createHabit({
        userId: userId,
        title: habitData.title.trim(),
        description: habitData.description.trim() || null,
        type: habitType,
        unit: hasUnit ? habitData.unit.trim() : null,
        dailyGoal: hasGoal ? parseInt(habitData.dailyGoal, 10) : null,
        category: habitData.category,
        presetName: habitData.selectedPreset ?? null,
        timeOfDay: habitData.timeOfDay,
        frequency: habitData.frequency,
        frequencyDays:
          habitData.frequency === "weekly"
            ? JSON.stringify(habitData.selectedWeekdays)
            : null,
        targetDate:
          habitData.frequency === "once" && habitData.targetDate
            ? habitData.targetDate
            : null,
        endDate: habitData.endDate,
      });

      // Schedule notification if requested
      if (habitData.enableReminder) {
        const granted = await requestPermissionsAsync();
        if (granted) {
          const notifId = await scheduleHabitNotification(newHabit);
          if (notifId) {
            await updateHabitNotification(newHabit.id, notifId, true);
          }
        } else {
          Alert.alert(t("error"), t("error_notification_permission"));
        }
      }

      await loadHabits();
      Alert.alert(t("success"), t("success_habit_created"));
      return true;
    } catch (error) {
      console.error("Error creating habit:", error);
      Alert.alert(t("error"), t("error_create_habit"));
      return false;
    }
  };

  // Toggle a boolean habit
  const toggleBooleanHabit = async (habit: Habit) => {
    if (!userId) return;

    try {
      const existingLog = habitLogs.get(habit.id);
      const updatedLog = await toggleBooleanHabitLog(
        habit.id,
        dateStr,
        userId,
        existingLog,
      );

      setHabitLogs((prev) => new Map(prev).set(habit.id, updatedLog));
    } catch (error) {
      console.error("Error toggling habit:", error);
      Alert.alert("Error", "Failed to update habit");
    }
  };

  // Update a counter habit value
  const updateCounterValue = async (habit: Habit, value: number) => {
    if (!userId) return;

    try {
      const existingLog = habitLogs.get(habit.id);
      const updatedLog = await updateCounterHabitLog(
        habit.id,
        dateStr,
        value,
        habit.dailyGoal,
        userId,
        existingLog,
      );

      setHabitLogs((prev) => new Map(prev).set(habit.id, updatedLog));
    } catch (error) {
      console.error("Error updating counter:", error);
      Alert.alert("Error", "Failed to update counter");
    }
  };

  // Delete a habit (confirmation is handled in HabitCard's Action Modal)
  const deleteHabit = async (habit: Habit) => {
    try {
      if (habit.notificationId) {
        await cancelHabitNotification(habit.notificationId);
      }
      await deleteHabitService(habit.id);
      await loadHabits();
    } catch (error) {
      console.error("Error deleting habit:", error);
      Alert.alert(t("error"), t("error_update_habit"));
    }
  };

  // Toggle scheduled notification for a habit
  const toggleHabitNotification = async (habit: Habit) => {
    try {
      if (habit.isNotificationsEnabled && habit.notificationId) {
        await cancelHabitNotification(habit.notificationId);
        await updateHabitNotification(habit.id, null, false);
      } else {
        const granted = await requestPermissionsAsync();
        if (!granted) {
          Alert.alert(t("error"), t("error_notification_permission"));
          return;
        }
        const notifId = await scheduleHabitNotification(habit);
        if (notifId) {
          await updateHabitNotification(habit.id, notifId, true);
        }
      }
      await loadHabits();
    } catch (error) {
      console.error("Error toggling notification:", error);
      Alert.alert(t("error"), t("error_update_habit"));
    }
  };

  return {
    userHabits,
    habitLogs,
    refreshing,
    categories,
    presets,
    onRefresh,
    handleAddHabit,
    toggleBooleanHabit,
    updateCounterValue,
    deleteHabit,
    toggleHabitNotification,
  };
}
