import React from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { X, Check, Minus, Plus } from "lucide-react-native";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import type { Habit, Log } from "../../db/schema";
import { useThemeColors } from "../../hooks/useThemeColors";

interface HabitDetailsModalProps {
  visible: boolean;
  habit: Habit | null;
  log?: Log;
  onClose: () => void;
  /** For boolean habits, call with no value to toggle.
   *  For counter habits, call with the new numeric value. */
  onUpdateLog: (habit: Habit, value?: number) => void;
}

/** Maps category names to a representative emoji. */
const CATEGORY_EMOJI: Record<string, string> = {
  cat_exercise: "🏋️",
  cat_daily_routines: "🧹",
  cat_daily_rhythm: "⏰",
  cat_nutrition: "🥗",
  cat_cleaning: "🧽",
  cat_responsibilities: "📋",
  cat_group_activities: "🎉",
};

const FREQUENCY_KEYS: Record<string, string> = {
  daily: "daily",
  weekly: "weekly",
  once: "once",
};

export default function HabitDetailsModal({
  visible,
  habit,
  log,
  onClose,
  onUpdateLog,
}: HabitDetailsModalProps) {
  const colors = useThemeColors();
  const { t } = useTranslation("common");

  if (!habit) return null;

  const isBoolean = habit.type === "boolean";
  const isCounter = habit.type === "counter";
  const isCompleted = log?.completed ?? false;
  const currentValue = log?.value ?? 0;
  const hasGoal = isCounter && !!habit.dailyGoal;
  const isGoalMet = hasGoal && currentValue >= (habit.dailyGoal ?? 0);
  const progressPct = hasGoal
    ? Math.min((currentValue / (habit.dailyGoal ?? 1)) * 100, 100)
    : 0;

  const categoryEmoji = habit.category
    ? (CATEGORY_EMOJI[habit.category] ?? "📌")
    : "📌";

  const createdDateLabel = habit.createdAt
    ? format(
        new Date((habit.createdAt as unknown as number) * 1000),
        "d MMM yyyy",
      )
    : "—";

  const frequencyLabel = t(FREQUENCY_KEYS[habit.frequency] ?? habit.frequency);

  const handleToggle = () => onUpdateLog(habit);
  const handleDecrement = () =>
    onUpdateLog(habit, Math.max(0, currentValue - 1));
  const handleIncrement = () => onUpdateLog(habit, currentValue + 1);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* Backdrop */}
        <TouchableOpacity
          className="absolute inset-0 bg-black/50"
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Sheet */}
        <View
          className="rounded-t-[24px]"
          style={{ backgroundColor: colors.surface }}
        >
          {/* Drag handle */}
          <View className="items-center pt-3 pb-1">
            <View
              className="h-1 w-10 rounded-full"
              style={{ backgroundColor: colors.border }}
            />
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
            <View className="flex-row items-center flex-1 mr-3">
              <Text className="text-2xl mr-2">{categoryEmoji}</Text>
              <Text
                className="text-lg font-bold flex-1"
                style={{ color: colors.text }}
                numberOfLines={2}
              >
                {habit.title}
              </Text>
            </View>
            <TouchableOpacity className="p-2" onPress={onClose}>
              <X color={colors.textSecondary} size={22} />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-6"
            contentContainerStyle={{ paddingBottom: 48 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Description */}
            {habit.description ? (
              <Text
                className="mb-4 text-sm leading-5"
                style={{ color: colors.textSecondary }}
              >
                {habit.description}
              </Text>
            ) : null}

            {/* Info row */}
            <View
              className="flex-row mb-5 rounded-xl overflow-hidden"
              style={{ backgroundColor: colors.background }}
            >
              <View className="flex-1 items-center py-3 px-2">
                <Text
                  className="text-xs mb-1"
                  style={{ color: colors.textSecondary }}
                >
                  {t("frequency")}
                </Text>
                <Text
                  className="text-sm font-semibold capitalize"
                  style={{ color: colors.text }}
                >
                  {frequencyLabel}
                </Text>
              </View>
              <View
                style={{
                  width: 1,
                  backgroundColor: colors.border,
                  marginVertical: 8,
                }}
              />
              <View className="flex-1 items-center py-3 px-2">
                <Text
                  className="text-xs mb-1"
                  style={{ color: colors.textSecondary }}
                >
                  {t("created_at")}
                </Text>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.text }}
                >
                  {createdDateLabel}
                </Text>
              </View>
              <View
                style={{
                  width: 1,
                  backgroundColor: colors.border,
                  marginVertical: 8,
                }}
              />
              <View className="flex-1 items-center py-3 px-2">
                <Text
                  className="text-xs mb-1"
                  style={{ color: colors.textSecondary }}
                >
                  {t("habit_type")}
                </Text>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.text }}
                >
                  {isBoolean
                    ? t("habit_type_boolean")
                    : t("habit_type_counter")}
                </Text>
              </View>
            </View>

            {/* ── Boolean action ─────────────────────────────────────── */}
            {isBoolean && (
              <TouchableOpacity
                className="rounded-xl py-4 items-center mb-2"
                style={{
                  backgroundColor: isCompleted
                    ? colors.success
                    : colors.primary,
                }}
                onPress={handleToggle}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center gap-x-2">
                  <Check color={colors.primaryForeground} size={20} />
                  <Text
                    className="text-base font-bold"
                    style={{ color: colors.primaryForeground }}
                  >
                    {isCompleted ? t("habit_undo") : t("habit_done")}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* ── Counter action ─────────────────────────────────────── */}
            {isCounter && (
              <View>
                {/* Value display */}
                <View className="items-center mb-4">
                  <Text
                    className="text-5xl font-bold"
                    style={{ color: isGoalMet ? colors.success : colors.text }}
                  >
                    {currentValue}
                  </Text>
                  {hasGoal && (
                    <Text
                      className="text-base mt-1"
                      style={{ color: colors.textSecondary }}
                    >
                      / {habit.dailyGoal}
                      {habit.unit ? ` ${habit.unit}` : ""}
                    </Text>
                  )}
                </View>

                {/* Progress bar */}
                {hasGoal && (
                  <View
                    className="h-3 rounded-full overflow-hidden mb-5"
                    style={{ backgroundColor: colors.border + "60" }}
                  >
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${progressPct}%`,
                        backgroundColor: isGoalMet
                          ? colors.success
                          : colors.primary,
                      }}
                    />
                  </View>
                )}

                {/* ± Buttons */}
                <View className="flex-row gap-x-3">
                  <TouchableOpacity
                    className="flex-1 py-4 rounded-xl items-center justify-center"
                    style={{ backgroundColor: colors.background }}
                    onPress={handleDecrement}
                    activeOpacity={0.7}
                  >
                    <Minus color={colors.text} size={24} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 py-4 rounded-xl items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                    onPress={handleIncrement}
                    activeOpacity={0.7}
                  >
                    <Plus color={colors.primaryForeground} size={24} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
