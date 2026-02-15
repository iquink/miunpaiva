import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, startOfToday, endOfDay, startOfDay } from "date-fns";
import { fi } from "date-fns/locale";
import { eq, and, desc, sql, lte } from "drizzle-orm";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";
import { db } from "../../db";
import {
  habits,
  logs,
  presetCategories,
  presetItems,
  type Habit,
  type Log,
  type PresetCategory,
  type PresetItem,
} from "../../db/schema";
import { checkAchievements } from "../../services/achievementService";
import HabitCard from "../../components/HabitCard";

export default function DashboardScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [userHabits, setUserHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<Map<number, Log>>(new Map());
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [newHabitDescription, setNewHabitDescription] = useState("");
  const [newHabitUnit, setNewHabitUnit] = useState("");
  const [newHabitGoal, setNewHabitGoal] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [categories, setCategories] = useState<PresetCategory[]>([]);
  const [presets, setPresets] = useState<PresetItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Schedule state
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "once">(
    "daily",
  );
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const todayStr = format(startOfToday(), "yyyy-MM-dd");

  // Helper: Toggle weekday selection
  const toggleWeekday = (day: number) => {
    setSelectedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  // Helper: Check if habit should be shown on selected date
  const shouldShowHabit = (habit: Habit): boolean => {
    const selectedDateEnd = endOfDay(selectedDate);

    // 1. Habit must have been created before or on selected date
    if (habit.createdAt && new Date(habit.createdAt) > selectedDateEnd) {
      return false;
    }

    // 2. Check end date (for daily/weekly)
    if (habit.endDate && new Date(habit.endDate) < selectedDateEnd) {
      return false;
    }

    // 3. Check frequency-specific rules
    if (habit.frequency === "once") {
      // One-time: only show on exact target date
      if (!habit.targetDate) return false;
      const selectedDateStart = startOfDay(selectedDate);
      const targetDateStart = startOfDay(new Date(habit.targetDate));
      return targetDateStart.getTime() === selectedDateStart.getTime();
    } else if (habit.frequency === "weekly") {
      // Weekly: check if selected date's weekday is in frequencyDays
      if (!habit.frequencyDays) return false;
      try {
        const days: number[] = JSON.parse(habit.frequencyDays);
        const selectedDayOfWeek = selectedDate.getDay();
        return days.includes(selectedDayOfWeek);
      } catch {
        return false;
      }
    } else {
      // Daily: always show (already checked end_date above)
      return true;
    }
  };

  // Load preset categories and items
  const loadPresets = useCallback(async () => {
    try {
      const fetchedCategories = await db.select().from(presetCategories);
      setCategories(fetchedCategories);

      const fetchedPresets = await db.select().from(presetItems);
      setPresets(fetchedPresets);
    } catch (error) {
      console.error("Error loading presets:", error);
    }
  }, []);

  // Close modal when tab loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Cleanup when leaving tab
        if (showAddHabit) {
          setShowAddHabit(false);
          resetForm();
        }
      };
    }, [showAddHabit]),
  );

  const resetForm = () => {
    setNewHabitTitle("");
    setNewHabitDescription("");
    setNewHabitUnit("");
    setNewHabitGoal("");
    setSelectedCategory(null);
    setSelectedPreset(null);
    setFrequency("daily");
    setSelectedWeekdays([]);
    setTargetDate(null);
    setEndDate(null);
  };

  const loadHabits = useCallback(async () => {
    if (!user) return;

    try {
      // Get end of selected date as Date object for comparison
      const selectedDateEnd = endOfDay(selectedDate);

      // Fetch ALL habits for current user (we'll filter client-side)
      const fetchedHabits = await db
        .select()
        .from(habits)
        .where(eq(habits.userId, user.id))
        .orderBy(desc(habits.createdAt));

      // Filter habits based on schedule
      const visibleHabits = fetchedHabits.filter(shouldShowHabit);

      setUserHabits(visibleHabits);

      // Fetch logs for selected date
      const logsMap = new Map<number, Log>();

      for (const habit of visibleHabits) {
        const [log] = await db
          .select()
          .from(logs)
          .where(and(eq(logs.habitId, habit.id), eq(logs.date, dateStr)))
          .limit(1);

        if (log) {
          logsMap.set(habit.id, log);
        }
      }

      setHabitLogs(logsMap);
    } catch (error) {
      console.error("Error loading habits:", error);
      Alert.alert(t("error"), t("error_load_habits"));
    }
  }, [user, dateStr, selectedDate, t]);

  useEffect(() => {
    loadHabits();
    loadPresets();
  }, [loadHabits, loadPresets]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  const handleAddHabit = async () => {
    if (!user || !newHabitTitle.trim()) {
      Alert.alert(t("error"), t("error_title_required"));
      return;
    }

    // Validate schedule fields
    if (frequency === "once" && !targetDate) {
      Alert.alert(
        t("error"),
        "Please select a target date for one-time habits",
      );
      return;
    }

    if (frequency === "weekly" && selectedWeekdays.length === 0) {
      Alert.alert(t("error"), "Please select at least one weekday");
      return;
    }

    try {
      // Auto-detect type based on unit/goal
      const hasUnit = newHabitUnit.trim().length > 0;
      const hasGoal = newHabitGoal.trim().length > 0;
      const habitType: "boolean" | "counter" =
        hasUnit || hasGoal ? "counter" : "boolean";

      await db.insert(habits).values({
        userId: user.id,
        title: newHabitTitle.trim(),
        description: newHabitDescription.trim() || null,
        type: habitType,
        unit: hasUnit ? newHabitUnit.trim() : null,
        dailyGoal: hasGoal ? parseInt(newHabitGoal, 10) : null,
        category: selectedCategory,
        frequency: frequency,
        frequencyDays:
          frequency === "weekly" ? JSON.stringify(selectedWeekdays) : null,
        targetDate: frequency === "once" && targetDate ? targetDate : null,
        endDate: endDate,
      });

      resetForm();
      setShowAddHabit(false);
      await loadHabits();
      Alert.alert(t("success"), t("success_habit_created"));
    } catch (error) {
      console.error("Error creating habit:", error);
      Alert.alert(t("error"), t("error_create_habit"));
    }
  };

  const toggleBooleanHabit = async (habit: Habit) => {
    if (!user) return;

    try {
      const existingLog = habitLogs.get(habit.id);

      if (existingLog) {
        // Update existing log
        const newCompleted = !existingLog.completed;
        await db
          .update(logs)
          .set({ completed: newCompleted })
          .where(eq(logs.id, existingLog.id));

        const updatedLog = { ...existingLog, completed: newCompleted };
        setHabitLogs((prev) => new Map(prev).set(habit.id, updatedLog));
      } else {
        // Create new log
        const [newLog] = await db
          .insert(logs)
          .values({
            habitId: habit.id,
            date: dateStr,
            completed: true,
            value: 0,
          })
          .returning();

        setHabitLogs((prev) => new Map(prev).set(habit.id, newLog));
      }

      // Check for achievement unlocks
      await checkAchievements(user.id);
    } catch (error) {
      console.error("Error toggling habit:", error);
      Alert.alert("Error", "Failed to update habit");
    }
  };

  const updateCounterValue = async (habit: Habit, value: number) => {
    if (!user) return;

    try {
      const existingLog = habitLogs.get(habit.id);

      if (existingLog) {
        // Update existing log value
        await db
          .update(logs)
          .set({
            value,
            completed: habit.dailyGoal ? value >= habit.dailyGoal : value > 0,
          })
          .where(eq(logs.id, existingLog.id));

        const updatedLog = {
          ...existingLog,
          value,
          completed: habit.dailyGoal ? value >= habit.dailyGoal : value > 0,
        };
        setHabitLogs((prev) => new Map(prev).set(habit.id, updatedLog));
      } else {
        // Create new log
        const [newLog] = await db
          .insert(logs)
          .values({
            habitId: habit.id,
            date: dateStr,
            value,
            completed: habit.dailyGoal ? value >= habit.dailyGoal : value > 0,
          })
          .returning();

        setHabitLogs((prev) => new Map(prev).set(habit.id, newLog));
      }

      // Check for achievement unlocks
      await checkAchievements(user.id);
    } catch (error) {
      console.error("Error updating counter:", error);
      Alert.alert("Error", "Failed to update counter");
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const deleteHabit = async (habitId: number) => {
    Alert.alert(t("delete"), t("delete_achievement_message"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await db.delete(habits).where(eq(habits.id, habitId));
            await loadHabits();
          } catch (error) {
            console.error("Error deleting habit:", error);
            Alert.alert(t("error"), t("error_update_habit"));
          }
        },
      },
    ]);
  };

  const selectPreset = (presetName: string) => {
    setNewHabitTitle(presetName);
    setSelectedPreset(presetName);
  };

  const filteredPresets = presets.filter((p) =>
    categories.find(
      (c) => c.id === p.categoryId && c.label === selectedCategory,
    ),
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <View className="bg-white dark:bg-slate-800 px-6 pb-4 pt-12">
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("dashboard")}
        </Text>
        <Text className="mt-1 text-gray-600 dark:text-gray-400">
          {t("dashboard_subtitle")}
        </Text>
      </View>

      {/* Date Selector */}
      <View className="flex-row items-center justify-between bg-white dark:bg-slate-800 px-6 py-4">
        <TouchableOpacity
          onPress={() => changeDate(-1)}
          className="rounded-lg p-2"
        >
          <ChevronLeft color="#6b7280" size={24} />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {dateStr === todayStr
            ? t("today")
            : format(selectedDate, "eeeeee dd.MM.yyyy", { locale: fi })}
        </Text>

        <TouchableOpacity
          onPress={() => changeDate(1)}
          className="rounded-lg p-2"
        >
          <ChevronRight color="#6b7280" size={24} />
        </TouchableOpacity>
      </View>

      {/* Habits List */}
      <ScrollView
        className="flex-1 px-6 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {userHabits.length === 0 ? (
          <View className="mt-8 items-center">
            <Text className="text-gray-500 dark:text-gray-400">
              {t("no_habits")}
            </Text>
          </View>
        ) : (
          userHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              log={habitLogs.get(habit.id)}
              selectedDate={selectedDate}
              onToggle={toggleBooleanHabit}
              onUpdateValue={updateCounterValue}
              onLongPress={deleteHabit}
            />
          ))
        )}
      </ScrollView>

      {/* Add Habit Button */}
      {!showAddHabit && (
        <TouchableOpacity
          onPress={() => setShowAddHabit(true)}
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg"
        >
          <Plus color="white" size={28} />
        </TouchableOpacity>
      )}

      {/* Add Habit Form */}
      {showAddHabit && (
        <View className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <ScrollView
            className="p-6"
            contentContainerStyle={{ paddingBottom: 220 }}
          >
            <Text className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
              {t("new_habit")}
            </Text>

            {/* Category Selector */}
            <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("select_category")}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              <View className="flex-row gap-2">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => {
                      setSelectedCategory(category.label);
                      setSelectedPreset(null);
                    }}
                    className={`rounded-full border px-4 py-2 ${
                      selectedCategory === category.label
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                        : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedCategory === category.label
                          ? "text-blue-500 dark:text-blue-300"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Preset Items */}
            {selectedCategory && filteredPresets.length > 0 && (
              <>
                <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("select_preset")}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4"
                >
                  <View className="flex-row gap-2">
                    {filteredPresets.map((preset) => (
                      <TouchableOpacity
                        key={preset.id}
                        onPress={() => selectPreset(preset.name)}
                        className={`rounded-full border px-4 py-2 ${
                          selectedPreset === preset.name
                            ? "border-green-500 bg-green-50 dark:bg-green-900"
                            : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                        }`}
                      >
                        <Text
                          className={`text-sm ${
                            selectedPreset === preset.name
                              ? "text-green-600 dark:text-green-300"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {preset.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </>
            )}

            <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("or_custom")}
            </Text>

            <TextInput
              className="mb-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-gray-900 dark:text-gray-100"
              placeholder={t("habit_title")}
              placeholderTextColor="#9ca3af"
              value={newHabitTitle}
              onChangeText={setNewHabitTitle}
            />

            <TextInput
              className="mb-4 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-gray-900 dark:text-gray-100"
              placeholder={t("habit_description")}
              placeholderTextColor="#9ca3af"
              value={newHabitDescription}
              onChangeText={setNewHabitDescription}
              multiline
              numberOfLines={2}
            />

            <Text className="mb-2 text-xs text-gray-500 dark:text-gray-400">
              {t("habit_type_hint")}
            </Text>

            <View className="mb-4 space-y-3">
              <TextInput
                className="rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-gray-900 dark:text-gray-100"
                placeholder={t("habit_unit")}
                placeholderTextColor="#9ca3af"
                value={newHabitUnit}
                onChangeText={setNewHabitUnit}
              />
              <TextInput
                className="rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-gray-900 dark:text-gray-100"
                placeholder={t("habit_daily_goal")}
                placeholderTextColor="#9ca3af"
                value={newHabitGoal}
                onChangeText={setNewHabitGoal}
                keyboardType="numeric"
              />
            </View>

            {/* Schedule Section */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t("schedule")}
              </Text>

              {/* Frequency Selector */}
              <View className="mb-3 flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setFrequency("daily")}
                  className={`flex-1 rounded-lg border py-2 ${
                    frequency === "daily"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                      : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                  }`}
                >
                  <Text
                    className={`text-center text-sm font-medium ${
                      frequency === "daily"
                        ? "text-blue-600 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {t("daily")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setFrequency("weekly")}
                  className={`flex-1 rounded-lg border py-2 ${
                    frequency === "weekly"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                      : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                  }`}
                >
                  <Text
                    className={`text-center text-sm font-medium ${
                      frequency === "weekly"
                        ? "text-blue-600 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {t("weekly")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setFrequency("once")}
                  className={`flex-1 rounded-lg border py-2 ${
                    frequency === "once"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                      : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                  }`}
                >
                  <Text
                    className={`text-center text-sm font-medium ${
                      frequency === "once" ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    {t("once")}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Weekday Selector (Weekly only) */}
              {frequency === "weekly" && (
                <View className="mb-3">
                  <Text className="mb-2 text-xs text-gray-600 dark:text-gray-400">
                    {t("select_weekdays")}
                  </Text>
                  <View className="flex-row justify-between">
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                      const labels = [
                        "weekday_sun",
                        "weekday_mon",
                        "weekday_tue",
                        "weekday_wed",
                        "weekday_thu",
                        "weekday_fri",
                        "weekday_sat",
                      ];
                      return (
                        <TouchableOpacity
                          key={day}
                          onPress={() => toggleWeekday(day)}
                          className={`h-10 w-10 items-center justify-center rounded-full ${
                            selectedWeekdays.includes(day)
                              ? "bg-blue-500"
                              : "bg-gray-200"
                          }`}
                        >
                          <Text
                            className={`text-xs font-semibold ${
                              selectedWeekdays.includes(day)
                                ? "text-white"
                                : "text-gray-600"
                            }`}
                          >
                            {t(labels[day])}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Target Date (One-time only) */}
              {frequency === "once" && (
                <View className="mb-3">
                  <Text className="mb-2 text-xs text-gray-600 dark:text-gray-400">
                    {t("target_date")}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowTargetPicker(true)}
                    className="rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3"
                  >
                    <Text className="text-gray-900 dark:text-gray-100">
                      {targetDate
                        ? format(targetDate, "eeeeee d.M.yyyy", { locale: fi })
                        : t("target_date")}
                    </Text>
                  </TouchableOpacity>
                  {showTargetPicker && (
                    <DateTimePicker
                      value={targetDate || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, date) => {
                        setShowTargetPicker(Platform.OS === "ios");
                        if (date) setTargetDate(date);
                      }}
                    />
                  )}
                </View>
              )}

              {/* End Date (Daily/Weekly) */}
              {(frequency === "daily" || frequency === "weekly") && (
                <View className="mb-3">
                  <Text className="mb-2 text-xs text-gray-600 dark:text-gray-400">
                    {t("end_date_optional")}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowEndPicker(true)}
                    className="rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3"
                  >
                    <Text className="text-gray-900 dark:text-gray-100">
                      {endDate
                        ? format(endDate, "eeeeee d.M.yyyy", { locale: fi })
                        : t("forever")}
                    </Text>
                  </TouchableOpacity>
                  {showEndPicker && (
                    <DateTimePicker
                      value={endDate || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, date) => {
                        setShowEndPicker(Platform.OS === "ios");
                        if (date) {
                          setEndDate(date);
                        }
                      }}
                    />
                  )}
                  {endDate && (
                    <TouchableOpacity
                      onPress={() => setEndDate(null)}
                      className="mt-2"
                    >
                      <Text className="text-xs text-blue-500">
                        Clear end date
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => {
                  setShowAddHabit(false);
                  resetForm();
                }}
                className="flex-1 rounded-lg border border-gray-300 dark:border-slate-600 py-3"
              >
                <Text className="text-center font-semibold text-gray-600 dark:text-gray-300">
                  {t("cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddHabit}
                className="flex-1 rounded-lg bg-blue-500 py-3"
              >
                <Text className="text-center font-semibold text-white">
                  {t("add")}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
