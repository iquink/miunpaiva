import React, { useState, useCallback, useMemo } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { startOfToday } from "date-fns";
import { Plus } from "lucide-react-native";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";
import HabitCard from "../../components/habits/HabitCard";
import { useHabits } from "../../hooks/useHabits";
import ScreenHeader from "../../components/ui/ScreenHeader";
import IconButton from "../../components/ui/IconButton";
import DatePaginator from "../../components/habits/DatePaginator";
import CreateHabitForm from "../../components/habits/CreateHabitForm";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function DashboardScreen() {
  const { t } = useTranslation("common");
  const colors = useThemeColors();
  const user = useAuthStore((state) => state.user);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [showPicker, setShowPicker] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);

  // Chronological order for time-of-day sections
  const TIME_OF_DAY_ORDER = [
    "morning",
    "late_morning",
    "afternoon",
    "evening",
    "all_day",
  ] as const;

  type TimeOfDay = (typeof TIME_OF_DAY_ORDER)[number];

  // Use the custom hook for habits management
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
  } = useHabits(user?.id, selectedDate);

  // Group visible habits into chronological sections; omit empty sections
  const groupedHabits = useMemo(() => {
    const groups: Record<TimeOfDay, typeof userHabits> = {
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
      (key) => ({ key, habits: groups[key] }),
    );
  }, [userHabits]);

  // Close modal when tab loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Cleanup when leaving tab
        if (showAddHabit) {
          setShowAddHabit(false);
        }
      };
    }, [showAddHabit]),
  );

  const handleAddHabitWrapper = async (data: {
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
    const success = await addHabit(data);

    if (success) {
      setShowAddHabit(false);
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Android closes the dialog automatically; just capture the result.
  const onPickerChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowPicker(false);
    if (event.type === "set" && date) {
      setSelectedDate(date);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title={t("dashboard")} subtitle={t("dashboard_subtitle")} />

      <DatePaginator
        selectedDate={selectedDate}
        onPrevDay={() => changeDate(-1)}
        onNextDay={() => changeDate(1)}
        onDatePress={() => setShowPicker(true)}
      />

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onPickerChange}
        />
      )}

      {/* Habits List */}
      <ScrollView
        className="flex-1 px-6 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {userHabits.length === 0 ? (
          <View className="mt-8 items-center">
            <Text style={{ color: colors.textSecondary }}>
              {t("no_habits")}
            </Text>
          </View>
        ) : (
          groupedHabits.map(({ key, habits }) => (
            <View key={key}>
              <Text
                className="text-xl font-bold mt-6 mb-3 px-2"
                style={{ color: colors.text }}
              >
                {t(`time_zones.${key}`)}
              </Text>
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  log={habitLogs.get(habit.id)}
                  selectedDate={selectedDate}
                  onToggle={toggleBooleanHabit}
                  onUpdateValue={updateCounterValue}
                  onToggleNotification={toggleHabitNotification}
                  onDelete={deleteHabit}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Habit Button */}
      {!showAddHabit && (
        <IconButton
          icon={<Plus color="white" size={28} />}
          onPress={() => setShowAddHabit(true)}
          className="absolute bottom-6 right-6"
        />
      )}

      {/* Add Habit Form */}
      {showAddHabit && (
        <CreateHabitForm
          categories={categories}
          presets={presets}
          onSubmit={handleAddHabitWrapper}
          onCancel={() => setShowAddHabit(false)}
        />
      )}
    </View>
  );
}
