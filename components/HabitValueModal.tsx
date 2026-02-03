import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { X, Plus, Minus } from "lucide-react-native";
import type { Habit } from "../db/schema";

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
        <View className="w-full rounded-2xl bg-white p-6">
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">
              {habit.title}
            </Text>
            <TouchableOpacity onPress={onClose} className="rounded-full p-1">
              <X color="#6b7280" size={24} />
            </TouchableOpacity>
          </View>

          {/* Description */}
          {habit.description && (
            <Text className="mb-4 text-sm text-gray-600">
              {habit.description}
            </Text>
          )}

          {/* Current/Goal Display */}
          <View className="mb-6 rounded-lg bg-gray-50 p-4">
            <Text className="text-center text-sm text-gray-600">
              Today's Progress
            </Text>
            <Text className="mt-1 text-center text-2xl font-bold text-gray-900">
              {currentValue}
              {habit.dailyGoal && ` / ${habit.dailyGoal}`}
              {habit.unit && ` ${habit.unit}`}
            </Text>
          </View>

          {/* Value Input with Steppers */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-gray-700">
              Add Value
            </Text>
            <View className="flex-row items-center justify-center gap-3">
              <TouchableOpacity
                onPress={handleDecrement}
                className="h-12 w-12 items-center justify-center rounded-full bg-gray-200"
              >
                <Minus color="#374151" size={24} />
              </TouchableOpacity>

              <TextInput
                className="h-14 w-24 rounded-lg border-2 border-blue-500 bg-white px-4 text-center text-xl font-semibold"
                keyboardType="numeric"
                value={value}
                onChangeText={setValue}
                selectTextOnFocus
              />

              <TouchableOpacity
                onPress={handleIncrement}
                className="h-12 w-12 items-center justify-center rounded-full bg-blue-500"
              >
                <Plus color="white" size={24} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-3"
            >
              <Text className="text-center font-semibold text-gray-600">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 rounded-lg bg-blue-500 py-3"
            >
              <Text className="text-center font-semibold text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
