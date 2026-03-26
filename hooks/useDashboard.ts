import { useState, useCallback, useMemo } from "react";
import { useFocusEffect } from "expo-router";
import { startOfToday } from "date-fns";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import type { Habit, Log, PresetCategory, PresetItem } from "../db/schema";
import { useHabits } from "./useHabits";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TimeOfDay =
  | "morning"
  | "late_morning"
  | "afternoon"
  | "evening"
  | "all_day";

export interface HabitSection {
  key: TimeOfDay;
  /** Dot-notation i18n key, e.g. "time_zones.morning" */
  titleKey: string;
  habits: Habit[];
}

export type NewHabitData = {
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
  timeOfDay: TimeOfDay;
  enableReminder: boolean;
};

// ---------------------------------------------------------------------------
// Constants (module-level — not re-created on each render)
// ---------------------------------------------------------------------------

const TIME_OF_DAY_ORDER: TimeOfDay[] = [
  "morning",
  "late_morning",
  "afternoon",
  "evening",
  "all_day",
];

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useDashboard(userId: number | undefined) {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const {
    userHabits,
    habitLogs,
    refreshing,
    categories,
    presets,
    onRefresh,
    handleAddHabit: addHabit,
    toggleBooleanHabit,
    updateCounterValue,
    deleteHabit,
    toggleHabitNotification,
  } = useHabits(userId, selectedDate);

  // Group visible habits into chronological sections; empty sections are omitted.
  const sections = useMemo<HabitSection[]>(() => {
    const groups: Record<TimeOfDay, Habit[]> = {
      morning: [],
      late_morning: [],
      afternoon: [],
      evening: [],
      all_day: [],
    };

    for (const habit of userHabits) {
      const slot = (habit.timeOfDay ?? "all_day") as TimeOfDay;
      if (slot in groups) {
        groups[slot].push(habit);
      } else {
        groups.all_day.push(habit);
      }
    }

    return TIME_OF_DAY_ORDER.filter((key) => groups[key].length > 0).map(
      (key) => ({ key, titleKey: `time_zones.${key}`, habits: groups[key] }),
    );
  }, [userHabits]);

  // Close the Add Habit modal whenever the tab loses focus.
  useFocusEffect(
    useCallback(() => {
      return () => {
        setShowAddHabit(false);
      };
    }, []),
  );

  // ---------------------------------------------------------------------------
  // Date navigation
  // ---------------------------------------------------------------------------

  const goToPrevDay = useCallback(() => {
    setSelectedDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() - 1);
      return next;
    });
  }, []);

  const goToNextDay = useCallback(() => {
    setSelectedDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      return next;
    });
  }, []);

  const openDatePicker = useCallback(() => setShowPicker(true), []);

  const onDateChange = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      setShowPicker(false);
      if (event.type === "set" && date) {
        setSelectedDate(date);
      }
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Modal control
  // ---------------------------------------------------------------------------

  const openAddHabit = useCallback(() => setShowAddHabit(true), []);
  const closeAddHabit = useCallback(() => setShowAddHabit(false), []);

  // Wraps the useHabits handler: closes the form on success.
  const handleAddHabit = useCallback(
    async (data: NewHabitData) => {
      const success = await addHabit(data);
      if (success) {
        closeAddHabit();
      }
    },
    [addHabit, closeAddHabit],
  );

  // ---------------------------------------------------------------------------
  // Log accessor
  // ---------------------------------------------------------------------------

  const getLogFor = useCallback(
    (habitId: number): Log | undefined => habitLogs.get(habitId),
    [habitLogs],
  );

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    // UI state
    selectedDate,
    showAddHabit,
    showPicker,

    // Derived data
    sections,
    isEmpty: userHabits.length === 0,

    // Habits data
    refreshing,
    categories,
    presets,

    // Handlers
    onRefresh,
    handleAddHabit,
    toggleBooleanHabit,
    updateCounterValue,
    deleteHabit,
    toggleHabitNotification,
    getLogFor,

    // Date navigation
    goToPrevDay,
    goToNextDay,
    openDatePicker,
    onDateChange,

    // Modal control
    openAddHabit,
    closeAddHabit,
  };
}
