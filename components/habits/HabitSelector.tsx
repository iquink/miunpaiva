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
        className="flex-row items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3"
      >
        <Text
          className={selectedHabit ? "text-gray-900" : "text-gray-400"}
          numberOfLines={1}
        >
          {selectedHabit ? selectedHabit.title : placeholder}
        </Text>
        <ChevronDown color="#9CA3AF" size={20} />
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
              className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg"
              onPress={(e) => e.stopPropagation()}
            >
              <Text className="mb-4 text-lg font-bold text-gray-900">
                Select Habit
              </Text>

              {availableHabits.length === 0 ? (
                <Text className="py-8 text-center text-gray-400">
                  No habits available
                </Text>
              ) : (
                <ScrollView className="max-h-80">
                  {availableHabits.map((habit) => (
                    <TouchableOpacity
                      key={habit.id}
                      onPress={() => {
                        onSelect(habit.id);
                        setModalVisible(false);
                      }}
                      className={`mb-2 rounded-lg border p-3 ${
                        selectedHabitId === habit.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          selectedHabitId === habit.id
                            ? "text-blue-500"
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
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="mt-4 rounded-lg bg-gray-200 py-3"
              >
                <Text className="text-center font-semibold text-gray-700">
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
