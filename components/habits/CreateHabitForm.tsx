import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
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
import { useThemeColors } from "../../hooks/useThemeColors";
import { getNotificationTimeLabel } from "../../services/notificationService";

interface Category {
  id: number;
  label: string;
}

interface Preset {
  id: number;
  name: string;
  categoryId: number;
  defaultType?: string | null;
  defaultGoal?: number | null;
  defaultUnit?: string | null;
}

type TimeOfDay =
  | "morning"
  | "late_morning"
  | "afternoon"
  | "evening"
  | "all_day";

interface HabitFormData {
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
}

interface CreateHabitFormProps {
  categories: Category[];
  presets: Preset[];
  onSubmit: (data: HabitFormData) => void;
  onCancel: () => void;
}

const TIME_OF_DAY_OPTIONS: TimeOfDay[] = [
  "morning",
  "late_morning",
  "afternoon",
  "evening",
  "all_day",
];

export default function CreateHabitForm({
  categories,
  presets,
  onSubmit,
  onCancel,
}: CreateHabitFormProps) {
  const { t } = useTranslation("common");
  const colors = useThemeColors();

  // Tab: "preset" | "custom"
  const [activeTab, setActiveTab] = useState<"preset" | "custom">("preset");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [dailyGoal, setDailyGoal] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("all_day");
  const [enableReminder, setEnableReminder] = useState(false);

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

  const handleTabChange = (tab: "preset" | "custom") => {
    setActiveTab(tab);
    if (tab === "custom") {
      // Clear preset selection when switching to custom
      setSelectedCategory(null);
      setSelectedPreset(null);
    } else {
      // Clear custom title when switching to preset
      setTitle("");
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedPreset(null);
    setTitle("");
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    setTitle(t(presetId));

    const presetData = presets.find((p) => p.name === presetId);
    if (presetData) {
      setUnit(presetData.defaultUnit || "");
      setDailyGoal(
        presetData.defaultGoal ? presetData.defaultGoal.toString() : "",
      );
    }
  };

  const selectedPresetData = presets.find((p) => p.name === selectedPreset);
  const showCounterFields =
    activeTab === "custom" || selectedPresetData?.defaultType === "counter";

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      unit,
      dailyGoal,
      category: selectedCategory,
      selectedPreset,
      frequency,
      selectedWeekdays,
      targetDate,
      endDate,
      timeOfDay,
      enableReminder,
    });
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 max-h-[80%] rounded-t-2xl border-t"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <ScrollView
        className="p-6"
        contentContainerStyle={{ paddingBottom: 220 }}
      >
        <Text className="mb-4 text-lg font-bold" style={{ color: colors.text }}>
          {t("new_habit")}
        </Text>

        {/* ── Tab Bar ─────────────────────────────────────────────────────── */}
        <View
          className="mb-4 flex-row rounded-xl p-1"
          style={{ backgroundColor: colors.border }}
        >
          {(["preset", "custom"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => handleTabChange(tab)}
                className="flex-1 items-center rounded-lg py-3"
                style={{
                  backgroundColor: isActive ? colors.surface : "transparent",
                }}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{
                    color: isActive ? colors.primary : colors.textSecondary,
                  }}
                >
                  {tab === "preset"
                    ? t("tab_choose_preset")
                    : t("tab_custom_task")}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Tab 1: Choose Preset ─────────────────────────────────────────── */}
        {activeTab === "preset" && (
          <PresetSelector
            categories={categories}
            presets={presets}
            selectedCategory={selectedCategory}
            selectedPreset={selectedPreset}
            onCategorySelect={handleCategorySelect}
            onPresetSelect={handlePresetSelect}
          />
        )}

        {/* ── Tab 2: Custom Task ───────────────────────────────────────────── */}
        {activeTab === "custom" && (
          <Input
            className="mb-3"
            placeholder={t("habit_title")}
            value={title}
            onChangeText={setTitle}
          />
        )}

        {/* ── Time of Day Selector ─────────────────────────────────────────── */}
        <Text
          className="mb-2 text-sm font-semibold"
          style={{ color: colors.text }}
        >
          {t("time_of_day")}
        </Text>
        <View className="mb-4 flex-row flex-wrap gap-2">
          {TIME_OF_DAY_OPTIONS.map((option) => {
            const isSelected = timeOfDay === option;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => setTimeOfDay(option)}
                className="rounded-full border px-4 py-2"
                style={{
                  backgroundColor: isSelected
                    ? colors.primary + "20"
                    : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
              >
                <Text
                  className="text-sm font-medium"
                  style={{ color: isSelected ? colors.primary : colors.text }}
                >
                  {t(`time_of_day_${option}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Input
          className="mb-4"
          placeholder={t("habit_description")}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={2}
        />

        {showCounterFields && (
          <>
            <Text
              className="mb-2 text-xs"
              style={{ color: colors.textSecondary }}
            >
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
          </>
        )}

        {/* Schedule Section */}
        <View className="mb-4">
          <Text
            className="mb-2 text-sm font-semibold"
            style={{ color: colors.text }}
          >
            {t("schedule")}
          </Text>

          {/* Frequency Selector */}
          <View className="mb-3 flex-row gap-2">
            {(["daily", "weekly", "once"] as const).map((freq) => {
              const isSelected = frequency === freq;
              return (
                <TouchableOpacity
                  key={freq}
                  onPress={() => setFrequency(freq)}
                  className="flex-1 rounded-lg border py-2"
                  style={{
                    backgroundColor: isSelected
                      ? colors.primary + "20"
                      : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    className="text-center text-sm font-medium"
                    style={{ color: isSelected ? colors.primary : colors.text }}
                  >
                    {t(freq)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Weekday Selector (Weekly only) */}
          {frequency === "weekly" && (
            <View className="mb-3">
              <Text
                className="mb-2 text-xs"
                style={{ color: colors.textSecondary }}
              >
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
                  const isSelected = selectedWeekdays.includes(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      onPress={() => toggleWeekday(day)}
                      className="h-10 w-10 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: isSelected
                          ? colors.primary
                          : colors.border,
                      }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{
                          color: isSelected
                            ? colors.primaryForeground
                            : colors.text,
                        }}
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
              <Text
                className="mb-2 text-xs"
                style={{ color: colors.textSecondary }}
              >
                {t("target_date")}
              </Text>
              <TouchableOpacity
                onPress={() => setShowTargetPicker(true)}
                className="rounded-lg border px-4 py-3"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                }}
              >
                <Text style={{ color: colors.text }}>
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
              <Text
                className="mb-2 text-xs"
                style={{ color: colors.textSecondary }}
              >
                {t("end_date_optional")}
              </Text>
              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                className="rounded-lg border px-4 py-3"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                }}
              >
                <Text style={{ color: colors.text }}>
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
                  <Text className="text-xs" style={{ color: colors.primary }}>
                    Clear end date
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* ── Reminder Toggle ──────────────────────────────────────────── */}
        <View
          className="mb-4 flex-row items-center justify-between rounded-xl border p-4"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <View className="flex-1 mr-4">
            <Text
              className="text-sm font-semibold"
              style={{ color: colors.text }}
            >
              {t("notif_enable_reminder")}
            </Text>
            <Text
              className="text-xs mt-0.5"
              style={{ color: colors.textSecondary }}
            >
              {getNotificationTimeLabel(timeOfDay)}
            </Text>
          </View>
          <Switch
            value={enableReminder}
            onValueChange={setEnableReminder}
            trackColor={{ false: colors.border, true: colors.primary + "80" }}
            thumbColor={enableReminder ? colors.primary : colors.textSecondary}
          />
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
