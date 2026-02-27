import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, startOfToday } from "date-fns";
import { fi } from "date-fns/locale";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";
import HabitCard from "../../components/HabitCard";
import { useHabits } from "../../hooks/useHabits";
import ScreenHeader from "../../components/ui/ScreenHeader";
import IconButton from "../../components/ui/IconButton";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function DashboardScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [newHabitDescription, setNewHabitDescription] = useState("");
  const [newHabitUnit, setNewHabitUnit] = useState("");
  const [newHabitGoal, setNewHabitGoal] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

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
  } = useHabits(user?.id, selectedDate);

  // Helper: Toggle weekday selection
  const toggleWeekday = (day: number) => {
    setSelectedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

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

  const handleAddHabitWrapper = async () => {
    const success = await addHabit({
      title: newHabitTitle,
      description: newHabitDescription,
      unit: newHabitUnit,
      dailyGoal: newHabitGoal,
      category: selectedCategory,
      frequency,
      selectedWeekdays,
      targetDate,
      endDate,
    });

    if (success) {
      resetForm();
      setShowAddHabit(false);
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
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
      <ScreenHeader title={t("dashboard")} subtitle={t("dashboard_subtitle")} />

      {/* Date Selector */}
      <View className="flex-row items-center justify-between bg-white dark:bg-slate-800 px-6 py-4">
        <IconButton
          variant="ghost"
          size="md"
          icon={<ChevronLeft color="#6b7280" size={24} />}
          onPress={() => changeDate(-1)}
        />

        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {dateStr === todayStr
            ? t("today")
            : format(selectedDate, "eeeeee dd.MM.yyyy", { locale: fi })}
        </Text>

        <IconButton
          variant="ghost"
          size="md"
          icon={<ChevronRight color="#6b7280" size={24} />}
          onPress={() => changeDate(1)}
        />
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
        <IconButton
          icon={<Plus color="white" size={28} />}
          onPress={() => setShowAddHabit(true)}
          className="absolute bottom-6 right-6"
        />
      )}

      {/* Add Habit Form */}
      {showAddHabit && (
        <View className="absolute bottom-0 left-0 right-0 max-h-[80%] rounded-t-2xl border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
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

            <Input
              className="mb-3"
              placeholder={t("habit_title")}
              value={newHabitTitle}
              onChangeText={setNewHabitTitle}
            />

            <Input
              className="mb-4"
              placeholder={t("habit_description")}
              value={newHabitDescription}
              onChangeText={setNewHabitDescription}
              multiline
              numberOfLines={2}
            />

            <Text className="mb-2 text-xs text-gray-500 dark:text-gray-400">
              {t("habit_type_hint")}
            </Text>

            <View className="mb-4 space-y-3">
              <Input
                placeholder={t("habit_unit")}
                value={newHabitUnit}
                onChangeText={setNewHabitUnit}
              />
              <Input
                placeholder={t("habit_daily_goal")}
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
              <Button
                variant="secondary"
                className="flex-1"
                onPress={() => {
                  setShowAddHabit(false);
                  resetForm();
                }}
              >
                {t("cancel")}
              </Button>

              <Button className="flex-1" onPress={handleAddHabitWrapper}>
                {t("add")}
              </Button>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
