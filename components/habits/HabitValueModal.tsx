import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { X, Plus, Minus } from "lucide-react-native";
import type { Habit } from "../../db/schema";
import { useThemeColors } from "../../hooks/useThemeColors";
import React from "react";

interface HabitValueModalProps {
  visible: boolean;
  habit: Habit;
  currentValue: number;
  onClose: () => void;
  onSave: (value: number) => void;
}

export default function HabitValueModal({
  visible,
  habit,
  currentValue,
  onClose,
  onSave,
}: HabitValueModalProps) {
  const [value, setValue] = useState(currentValue.toString());
  const colors = useThemeColors();

  const handleIncrement = () => {
    const num = parseInt(value || "0", 10);
    setValue((num + 1).toString());
  };

  const handleDecrement = () => {
    const num = parseInt(value || "0", 10);
    if (num > 0) {
      setValue((num - 1).toString());
    }
  };

  const handleSave = () => {
    const numValue = parseInt(value || "0", 10);
    if (numValue >= 0) {
      onSave(numValue);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View
          className="w-full rounded-2xl p-6"
          style={{ backgroundColor: colors.surface }}
        >
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              {habit.title}
            </Text>
            <TouchableOpacity onPress={onClose} className="rounded-full p-1">
              <X color={colors.textSecondary} size={24} />
            </TouchableOpacity>
          </View>

          {/* Description */}
          {habit.description && (
            <Text
              className="mb-4 text-sm"
              style={{ color: colors.textSecondary }}
            >
              {habit.description}
            </Text>
          )}

          {/* Current/Goal Display */}
          <View
            className="mb-6 rounded-lg p-4"
            style={{ backgroundColor: colors.background }}
          >
            <Text
              className="text-center text-sm"
              style={{ color: colors.textSecondary }}
            >
              Today's Progress
            </Text>
            <Text
              className="mt-1 text-center text-2xl font-bold"
              style={{ color: colors.text }}
            >
              {currentValue}
              {habit.dailyGoal && ` / ${habit.dailyGoal}`}
              {habit.unit && ` ${habit.unit}`}
            </Text>
          </View>

          {/* Value Input with Steppers */}
          <View className="mb-6">
            <Text
              className="mb-2 text-sm font-medium"
              style={{ color: colors.text }}
            >
              Add Value
            </Text>
            <View className="flex-row items-center justify-center gap-3">
              <TouchableOpacity
                onPress={handleDecrement}
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.border }}
              >
                <Minus color={colors.text} size={24} />
              </TouchableOpacity>

              <TextInput
                className="h-14 w-24 rounded-lg border-2 px-4 text-center text-xl font-semibold"
                style={{
                  borderColor: colors.primary,
                  backgroundColor: colors.surface,
                  color: colors.text,
                }}
                keyboardType="numeric"
                value={value}
                onChangeText={setValue}
                selectTextOnFocus
                placeholderTextColor={colors.textSecondary}
              />

              <TouchableOpacity
                onPress={handleIncrement}
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.primary }}
              >
                <Plus color={colors.primaryForeground} size={24} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 rounded-lg border py-3"
              style={{ borderColor: colors.border }}
            >
              <Text
                className="text-center font-semibold"
                style={{ color: colors.text }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 rounded-lg py-3"
              style={{ backgroundColor: colors.primary }}
            >
              <Text
                className="text-center font-semibold"
                style={{ color: colors.primaryForeground }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
