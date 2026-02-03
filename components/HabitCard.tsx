import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Check, X, TrendingUp } from "lucide-react-native";
import type { Habit, Log } from "../db/schema";
import HabitValueModal from "./HabitValueModal";
import React from "react";

interface HabitCardProps {
  habit: Habit;
  log?: Log;
  onToggle: (habit: Habit) => void;
  onUpdateValue: (habit: Habit, value: number) => void;
  onLongPress: (habitId: number) => void;
}

export default function HabitCard({
  habit,
  log,
  onToggle,
  onUpdateValue,
  onLongPress,
}: HabitCardProps) {
  const [showModal, setShowModal] = useState(false);

  const isBoolean = habit.type === "boolean";
  const isCounter = habit.type === "counter";
  const currentValue = log?.value || 0;
  const isCompleted = log?.completed || false;

  const handlePress = () => {
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

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={() => onLongPress(habit.id)}
        className={`mb-3 rounded-xl p-4 ${
          isBoolean
            ? isCompleted
              ? "bg-green-100"
              : "bg-white"
            : isGoalMet
              ? "bg-green-100"
              : "bg-white"
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text
              className={`text-base font-semibold ${
                isBoolean
                  ? isCompleted
                    ? "text-green-800"
                    : "text-gray-900"
                  : isGoalMet
                    ? "text-green-800"
                    : "text-gray-900"
              }`}
            >
              {habit.title}
            </Text>

            {habit.description && (
              <Text className="mt-1 text-xs text-gray-500">
                {habit.description}
              </Text>
            )}

            {/* Counter Progress Display */}
            {isCounter && (
              <View className="mt-2">
                <Text className="text-sm font-medium text-gray-700">
                  {currentValue}
                  {habit.dailyGoal && ` / ${habit.dailyGoal}`}
                  {habit.unit && ` ${habit.unit}`}
                </Text>

                {habit.dailyGoal && (
                  <View className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                    <View
                      className={`h-full ${isGoalMet ? "bg-green-500" : "bg-blue-500"}`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Type Label */}
            <Text className="mt-2 text-xs text-gray-400">
              {isBoolean ? "Yes/No" : "Counter"}
            </Text>
          </View>

          {/* Icon */}
          <View
            className={`h-12 w-12 items-center justify-center rounded-full ${
              isBoolean
                ? isCompleted
                  ? "bg-green-500"
                  : "bg-gray-200"
                : isGoalMet
                  ? "bg-green-500"
                  : "bg-blue-500"
            }`}
          >
            {isBoolean ? (
              isCompleted ? (
                <Check color="white" size={24} />
              ) : (
                <X color="#9ca3af" size={24} />
              )
            ) : (
              <TrendingUp color="white" size={24} />
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
