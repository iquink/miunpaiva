import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Check, X, TrendingUp, Lock } from "lucide-react-native";
import type { Habit, Log } from "../../db/schema";
import HabitValueModal from "./HabitValueModal";
import { isDateEditable } from "../../utils/dateUtils";
import { useThemeColors } from "../../hooks/useThemeColors";
import React from "react";

interface HabitCardProps {
  habit: Habit;
  log?: Log;
  selectedDate: Date;
  onToggle: (habit: Habit) => void;
  onUpdateValue: (habit: Habit, value: number) => void;
  onLongPress: (habitId: number) => void;
}

export default function HabitCard({
  habit,
  log,
  selectedDate,
  onToggle,
  onUpdateValue,
  onLongPress,
}: HabitCardProps) {
  const [showModal, setShowModal] = useState(false);
  const colors = useThemeColors();

  const isBoolean = habit.type === "boolean";
  const isCounter = habit.type === "counter";
  const currentValue = log?.value || 0;
  const isCompleted = log?.completed || false;

  // Calculate if date is editable (Today or Yesterday only)
  const isEditable = isDateEditable(selectedDate);

  const handlePress = () => {
    if (!isEditable) return; // Locked - no action

    if (isBoolean) {
      onToggle(habit);
    } else if (isCounter) {
      setShowModal(true);
    }
  };

  const handleSaveValue = (value: number) => {
    onUpdateValue(habit, value);
  };

  // Calculate progress for counter habits
  const getProgressPercentage = () => {
    if (!isCounter || !habit.dailyGoal) return 0;
    return Math.min((currentValue / habit.dailyGoal) * 100, 100);
  };

  const progressPercentage = getProgressPercentage();
  const isGoalMet =
    isCounter && habit.dailyGoal && currentValue >= habit.dailyGoal;

  // Determine card background color
  const getCardBgColor = () => {
    if (isBoolean && isCompleted) return colors.success + "20";
    if (isCounter && isGoalMet) return colors.success + "20";
    return colors.surface;
  };

  // Determine text color for title
  const getTitleColor = () => {
    if (isBoolean && isCompleted) return colors.success;
    if (isCounter && isGoalMet) return colors.success;
    return colors.text;
  };

  // Determine icon background color
  const getIconBgColor = () => {
    if (!isEditable) return colors.border;
    if (isBoolean) {
      return isCompleted ? colors.success : colors.border;
    }
    return isGoalMet ? colors.success : colors.primary;
  };

  // Determine icon color
  const getIconColor = () => {
    if (!isEditable) return colors.textSecondary;
    if (isBoolean && !isCompleted) return colors.textSecondary;
    return colors.primaryForeground;
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={() => onLongPress(habit.id)}
        disabled={!isEditable}
        className="mb-3 rounded-xl p-4"
        style={{
          backgroundColor: getCardBgColor(),
          opacity: isEditable ? 1 : 0.5,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text
              className="text-base font-semibold"
              style={{ color: getTitleColor() }}
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
                  {currentValue}
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
                        width: `${progressPercentage}%`,
                        backgroundColor: isGoalMet
                          ? colors.success
                          : colors.primary,
                      }}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Type Label */}
            <Text
              className="mt-2 text-xs"
              style={{ color: colors.textSecondary }}
            >
              {isBoolean ? "Yes/No" : "Counter"}
            </Text>
          </View>

          {/* Icon */}
          <View
            className="h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: getIconBgColor() }}
          >
            {!isEditable ? (
              <Lock color={getIconColor()} size={20} />
            ) : isBoolean ? (
              isCompleted ? (
                <Check color={getIconColor()} size={24} />
              ) : (
                <X color={getIconColor()} size={24} />
              )
            ) : (
              <TrendingUp color={getIconColor()} size={24} />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Counter Value Modal */}
      {isCounter && (
        <HabitValueModal
          visible={showModal}
          habit={habit}
          currentValue={currentValue}
          onClose={() => setShowModal(false)}
          onSave={handleSaveValue}
        />
      )}
    </>
  );
}
