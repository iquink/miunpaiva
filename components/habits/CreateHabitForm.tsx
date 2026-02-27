import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { fi } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import Input from "../ui/Input";
import Button from "../ui/Button";
import PresetSelector from "./PresetSelector";

interface Category {
  id: number;
  label: string;
}

interface Preset {
  id: number;
  name: string;
  categoryId: number;
}

interface HabitFormData {
  title: string;
  description: string;
  unit: string;
  dailyGoal: string;
  category: string | null;
  frequency: "daily" | "weekly" | "once";
  selectedWeekdays: number[];
  targetDate: Date | null;
  endDate: Date | null;
}

interface CreateHabitFormProps {
  categories: Category[];
  presets: Preset[];
  onSubmit: (data: HabitFormData) => void;
  onCancel: () => void;
}

export default function CreateHabitForm({
  categories,
  presets,
  onSubmit,
  onCancel,
}: CreateHabitFormProps) {
  const { t } = useTranslation();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [dailyGoal, setDailyGoal] = useState("");
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

  const toggleWeekday = (day: number) => {
    setSelectedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedPreset(null);
  };

  const handlePresetSelect = (presetName: string) => {
    setTitle(presetName);
    setSelectedPreset(presetName);
  };

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      unit,
      dailyGoal,
      category: selectedCategory,
      frequency,
      selectedWeekdays,
      targetDate,
      endDate,
    });
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 max-h-[80%] rounded-t-2xl border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <ScrollView
        className="p-6"
        contentContainerStyle={{ paddingBottom: 220 }}
      >
        <Text className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
          {t("new_habit")}
        </Text>

        <PresetSelector
          categories={categories}
          presets={presets}
          selectedCategory={selectedCategory}
          selectedPreset={selectedPreset}
          onCategorySelect={handleCategorySelect}
          onPresetSelect={handlePresetSelect}
        />

        <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("or_custom")}
        </Text>

        <Input
          className="mb-3"
          placeholder={t("habit_title")}
          value={title}
          onChangeText={setTitle}
        />

        <Input
          className="mb-4"
          placeholder={t("habit_description")}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={2}
        />

        <Text className="mb-2 text-xs text-gray-500 dark:text-gray-400">
          {t("habit_type_hint")}
        </Text>

        <View className="mb-4 space-y-3">
          <Input
            placeholder={t("habit_unit")}
            value={unit}
            onChangeText={setUnit}
          />
          <Input
            placeholder={t("habit_daily_goal")}
            value={dailyGoal}
            onChangeText={setDailyGoal}
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
                  <Text className="text-xs text-blue-500">Clear end date</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View className="flex-row gap-2">
          <Button variant="secondary" className="flex-1" onPress={onCancel}>
            {t("cancel")}
          </Button>

          <Button className="flex-1" onPress={handleSubmit}>
            {t("add")}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
