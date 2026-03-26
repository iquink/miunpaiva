import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Check, X, TrendingUp, Lock } from "lucide-react-native";
import type { Habit, Log } from "../../db/schema";
import HabitValueModal from "./HabitValueModal";
import ActionBottomSheet from "./ActionBottomSheet";
import { isDateEditable } from "../../utils/dateUtils";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useTranslation } from "react-i18next";

interface HabitCardProps {
  habit: Habit;
  log?: Log;
  selectedDate: Date;
  onToggle: (habit: Habit) => void;
  onUpdateValue: (habit: Habit, value: number) => void;
  onToggleNotification: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

export default function HabitCard({
  habit,
  log,
  selectedDate,
  onToggle,
  onUpdateValue,
  onToggleNotification,
  onDelete,
}: HabitCardProps) {
  const [showValueModal, setShowValueModal] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const colors = useThemeColors();
  const { t } = useTranslation("common");

  const isBoolean = habit.type === "boolean";
  const isCounter = habit.type === "counter";
  const isEditable = isDateEditable(selectedDate);

  // Single memo consolidates all state-derived colors and computed values.
  // Re-runs only when the log, type flags, editability, goal, or theme change.
  const derived = useMemo(() => {
    const isCompleted = log?.completed ?? false;
    const currentValue = log?.value ?? 0;
    const isGoalMet =
      isCounter && !!habit.dailyGoal && currentValue >= habit.dailyGoal;
    const isAchieved = (isBoolean && isCompleted) || isGoalMet;

    return {
      isCompleted,
      currentValue,
      isGoalMet,
      progressPercentage:
        isCounter && habit.dailyGoal
          ? Math.min((currentValue / habit.dailyGoal) * 100, 100)
          : 0,
      cardBg: isAchieved ? colors.success + "20" : colors.surface,
      titleColor: isAchieved ? colors.success : colors.text,
      iconBg: !isEditable
        ? colors.border
        : isBoolean
          ? isCompleted
            ? colors.success
            : colors.border
          : isGoalMet
            ? colors.success
            : colors.primary,
      iconColor:
        !isEditable || (isBoolean && !isCompleted)
          ? colors.textSecondary
          : colors.primaryForeground,
    };
  }, [log, isBoolean, isCounter, isEditable, habit.dailyGoal, colors]);

  const handlePress = () => {
    if (!isEditable) return;
    if (isBoolean) {
      onToggle(habit);
    } else if (isCounter) {
      setShowValueModal(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={() => setShowActionSheet(true)}
        delayLongPress={400}
        className="mb-3 rounded-xl p-4"
        style={{
          backgroundColor: derived.cardBg,
          opacity: isEditable ? 1 : 0.5,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text
              className="text-base font-semibold"
              style={{ color: derived.titleColor }}
            >
              {habit.title}
            </Text>

            {habit.description && (
              <Text
                className="mt-1 text-xs"
                style={{ color: colors.textSecondary }}
              >
                {habit.description}
              </Text>
            )}

            {/* Counter Progress Display */}
            {isCounter && (
              <View className="mt-2">
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  {derived.currentValue}
                  {habit.dailyGoal && ` / ${habit.dailyGoal}`}
                  {habit.unit && ` ${habit.unit}`}
                </Text>

                {habit.dailyGoal && (
                  <View
                    className="mt-2 h-2 overflow-hidden rounded-full"
                    style={{ backgroundColor: colors.border + "40" }}
                  >
                    <View
                      className="h-full"
                      style={{
                        width: `${derived.progressPercentage}%`,
                        backgroundColor: derived.isGoalMet
                          ? colors.success
                          : colors.primary,
                      }}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Type Label — uses existing translation keys */}
            <Text
              className="mt-2 text-xs"
              style={{ color: colors.textSecondary }}
            >
              {isBoolean ? t("habit_type_boolean") : t("habit_type_counter")}
            </Text>
          </View>

          {/* Icon */}
          <View
            className="h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: derived.iconBg }}
          >
            {!isEditable ? (
              <Lock color={derived.iconColor} size={20} />
            ) : isBoolean ? (
              derived.isCompleted ? (
                <Check color={derived.iconColor} size={24} />
              ) : (
                <X color={derived.iconColor} size={24} />
              )
            ) : (
              <TrendingUp color={derived.iconColor} size={24} />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Counter Value Modal */}
      {isCounter && (
        <HabitValueModal
          visible={showValueModal}
          habit={habit}
          currentValue={derived.currentValue}
          onClose={() => setShowValueModal(false)}
          onSave={(value) => onUpdateValue(habit, value)}
        />
      )}

      <ActionBottomSheet
        visible={showActionSheet}
        habit={habit}
        onClose={() => setShowActionSheet(false)}
        onToggleNotification={() => onToggleNotification(habit)}
        onDelete={() => onDelete(habit)}
      />
    </>
  );
}
