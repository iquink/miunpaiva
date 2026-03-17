import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { ChevronDown } from "lucide-react-native";
import type { Habit } from "../../db/schema";
import { useThemeColors } from "../../hooks/useThemeColors";

interface HabitSelectorProps {
  habits: Habit[];
  selectedHabitId: number | null;
  onSelect: (habitId: number) => void;
  excludedHabitIds?: number[]; // IDs already used in other criteria
  placeholder?: string;
}

export default function HabitSelector({
  habits,
  selectedHabitId,
  onSelect,
  excludedHabitIds = [],
  placeholder = "Select a habit",
}: HabitSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const colors = useThemeColors();

  // Filter out excluded habits
  const availableHabits = habits.filter(
    (h) => !excludedHabitIds.includes(h.id),
  );

  const selectedHabit = habits.find((h) => h.id === selectedHabitId);

  return (
    <View>
      {/* Selector Button (looks like input) */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="flex-row items-center justify-between rounded-lg border px-4 py-3"
        style={{
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <Text
          style={{ color: selectedHabit ? colors.text : colors.textSecondary }}
          numberOfLines={1}
        >
          {selectedHabit ? selectedHabit.title : placeholder}
        </Text>
        <ChevronDown color={colors.textSecondary} size={20} />
      </TouchableOpacity>

      {/* Modal with habit list */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setModalVisible(false)}
        >
          <View className="flex-1 items-center justify-center px-6">
            <Pressable
              className="w-full max-w-md rounded-xl p-4 shadow-lg"
              style={{ backgroundColor: colors.surface }}
              onPress={(e) => e.stopPropagation()}
            >
              <Text
                className="mb-4 text-lg font-bold"
                style={{ color: colors.text }}
              >
                Select Habit
              </Text>

              {availableHabits.length === 0 ? (
                <Text
                  className="py-8 text-center"
                  style={{ color: colors.textSecondary }}
                >
                  No habits available
                </Text>
              ) : (
                <ScrollView className="max-h-80">
                  {availableHabits.map((habit) => {
                    const isSelected = selectedHabitId === habit.id;
                    return (
                      <TouchableOpacity
                        key={habit.id}
                        onPress={() => {
                          onSelect(habit.id);
                          setModalVisible(false);
                        }}
                        className="mb-2 rounded-lg border p-3"
                        style={{
                          borderColor: isSelected
                            ? colors.primary
                            : colors.border,
                          backgroundColor: isSelected
                            ? colors.primary + "20"
                            : colors.surface,
                        }}
                      >
                        <Text
                          className="font-medium"
                          style={{
                            color: isSelected ? colors.primary : colors.text,
                          }}
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
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="mt-4 rounded-lg py-3"
                style={{ backgroundColor: colors.background }}
              >
                <Text
                  className="text-center font-semibold"
                  style={{ color: colors.text }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
