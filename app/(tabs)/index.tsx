import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import { format, startOfToday, endOfDay } from "date-fns";
import { eq, and, desc, sql, lte } from "drizzle-orm";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useAuthStore } from "../../store/authStore";
import { db } from "../../db";
import { habits, logs, type Habit, type Log } from "../../db/schema";
import { checkAchievements } from "../../services/achievementService";
import HabitCard from "../../components/HabitCard";

export default function DashboardScreen() {
  const user = useAuthStore((state) => state.user);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [userHabits, setUserHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<Map<number, Log>>(new Map());
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [newHabitDescription, setNewHabitDescription] = useState("");
  const [newHabitType, setNewHabitType] = useState<"boolean" | "counter">(
    "boolean",
  );
  const [newHabitUnit, setNewHabitUnit] = useState("");
  const [newHabitGoal, setNewHabitGoal] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const dateStr = format(selectedDate, "yyyy-MM-dd");

  const loadHabits = useCallback(async () => {
    if (!user) return;

    try {
      // Get end of selected date as Date object for comparison
      const selectedDateEnd = endOfDay(selectedDate);

      // Fetch habits for current user created on or before selected date
      const fetchedHabits = await db
        .select()
        .from(habits)
        .where(
          and(
            eq(habits.userId, user.id),
            lte(habits.createdAt, selectedDateEnd),
          ),
        )
        .orderBy(desc(habits.createdAt));

      setUserHabits(fetchedHabits);

      // Fetch logs for selected date
      const logsMap = new Map<number, Log>();

      for (const habit of fetchedHabits) {
        const [log] = await db
          .select()
          .from(logs)
          .where(and(eq(logs.habitId, habit.id), eq(logs.date, dateStr)))
          .limit(1);

        if (log) {
          logsMap.set(habit.id, log);
        }
      }

      setHabitLogs(logsMap);
    } catch (error) {
      console.error("Error loading habits:", error);
      Alert.alert("Error", "Failed to load habits");
    }
  }, [user, dateStr, selectedDate]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  const handleAddHabit = async () => {
    if (!user || !newHabitTitle.trim()) {
      Alert.alert("Error", "Please enter a habit title");
      return;
    }

    try {
      await db.insert(habits).values({
        userId: user.id,
        title: newHabitTitle.trim(),
        description: newHabitDescription.trim() || null,
        type: newHabitType,
        unit:
          newHabitType === "counter" && newHabitUnit
            ? newHabitUnit.trim()
            : null,
        dailyGoal:
          newHabitType === "counter" && newHabitGoal
            ? parseInt(newHabitGoal, 10)
            : null,
      });

      setNewHabitTitle("");
      setNewHabitDescription("");
      setNewHabitUnit("");
      setNewHabitGoal("");
      setShowAddHabit(false);
      await loadHabits();
    } catch (error) {
      console.error("Error creating habit:", error);
      Alert.alert("Error", "Failed to create habit");
    }
  };

  const toggleBooleanHabit = async (habit: Habit) => {
    if (!user) return;

    try {
      const existingLog = habitLogs.get(habit.id);

      if (existingLog) {
        // Update existing log
        const newCompleted = !existingLog.completed;
        await db
          .update(logs)
          .set({ completed: newCompleted })
          .where(eq(logs.id, existingLog.id));

        const updatedLog = { ...existingLog, completed: newCompleted };
        setHabitLogs((prev) => new Map(prev).set(habit.id, updatedLog));
      } else {
        // Create new log
        const [newLog] = await db
          .insert(logs)
          .values({
            habitId: habit.id,
            date: dateStr,
            completed: true,
            value: 0,
          })
          .returning();

        setHabitLogs((prev) => new Map(prev).set(habit.id, newLog));
      }

      // Check for achievement unlocks
      await checkAchievements(user.id);
    } catch (error) {
      console.error("Error toggling habit:", error);
      Alert.alert("Error", "Failed to update habit");
    }
  };

  const updateCounterValue = async (habit: Habit, value: number) => {
    if (!user) return;

    try {
      const existingLog = habitLogs.get(habit.id);

      if (existingLog) {
        // Update existing log value
        await db
          .update(logs)
          .set({
            value,
            completed: habit.dailyGoal ? value >= habit.dailyGoal : value > 0,
          })
          .where(eq(logs.id, existingLog.id));

        const updatedLog = {
          ...existingLog,
          value,
          completed: habit.dailyGoal ? value >= habit.dailyGoal : value > 0,
        };
        setHabitLogs((prev) => new Map(prev).set(habit.id, updatedLog));
      } else {
        // Create new log
        const [newLog] = await db
          .insert(logs)
          .values({
            habitId: habit.id,
            date: dateStr,
            value,
            completed: habit.dailyGoal ? value >= habit.dailyGoal : value > 0,
          })
          .returning();

        setHabitLogs((prev) => new Map(prev).set(habit.id, newLog));
      }

      // Check for achievement unlocks
      await checkAchievements(user.id);
    } catch (error) {
      console.error("Error updating counter:", error);
      Alert.alert("Error", "Failed to update counter");
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const deleteHabit = async (habitId: number) => {
    Alert.alert("Delete Habit", "Are you sure you want to delete this habit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await db.delete(habits).where(eq(habits.id, habitId));
            await loadHabits();
          } catch (error) {
            console.error("Error deleting habit:", error);
            Alert.alert("Error", "Failed to delete habit");
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pb-4 pt-12">
        <Text className="text-2xl font-bold text-gray-900">
          Welcome, {user?.username}!
        </Text>
        <Text className="mt-1 text-gray-600">Track your daily habits</Text>
      </View>

      {/* Date Selector */}
      <View className="flex-row items-center justify-between bg-white px-6 py-4">
        <TouchableOpacity
          onPress={() => changeDate(-1)}
          className="rounded-lg p-2"
        >
          <ChevronLeft color="#6b7280" size={24} />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-gray-900">
          {format(selectedDate, "MMM dd, yyyy")}
        </Text>

        <TouchableOpacity
          onPress={() => changeDate(1)}
          className="rounded-lg p-2"
        >
          <ChevronRight color="#6b7280" size={24} />
        </TouchableOpacity>
      </View>

      {/* Habits List */}
      <ScrollView
        className="flex-1 px-6 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {userHabits.length === 0 ? (
          <View className="mt-8 items-center">
            <Text className="text-gray-500">
              No habits yet. Create your first one!
            </Text>
          </View>
        ) : (
          userHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              log={habitLogs.get(habit.id)}
              onToggle={toggleBooleanHabit}
              onUpdateValue={updateCounterValue}
              onLongPress={deleteHabit}
            />
          ))
        )}
      </ScrollView>

      {/* Add Habit Button */}
      {!showAddHabit && (
        <TouchableOpacity
          onPress={() => setShowAddHabit(true)}
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg"
        >
          <Plus color="white" size={28} />
        </TouchableOpacity>
      )}

      {/* Add Habit Form */}
      {showAddHabit && (
        <View className="border-t border-gray-200 bg-white p-6">
          <Text className="mb-4 text-lg font-bold text-gray-900">
            New Habit
          </Text>

          <TextInput
            className="mb-3 rounded-lg border border-gray-300 px-4 py-3"
            placeholder="Habit name"
            value={newHabitTitle}
            onChangeText={setNewHabitTitle}
            autoFocus
          />

          <TextInput
            className="mb-4 rounded-lg border border-gray-300 px-4 py-3"
            placeholder="Description (optional)"
            value={newHabitDescription}
            onChangeText={setNewHabitDescription}
            multiline
            numberOfLines={2}
          />

          <View className="mb-4 flex-row gap-2">
            <TouchableOpacity
              onPress={() => setNewHabitType("boolean")}
              className={`flex-1 rounded-lg border py-3 ${
                newHabitType === "boolean"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  newHabitType === "boolean" ? "text-blue-500" : "text-gray-600"
                }`}
              >
                Yes/No
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setNewHabitType("counter")}
              className={`flex-1 rounded-lg border py-3 ${
                newHabitType === "counter"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  newHabitType === "counter" ? "text-blue-500" : "text-gray-600"
                }`}
              >
                Counter
              </Text>
            </TouchableOpacity>
          </View>

          {/* Counter-specific fields */}
          {newHabitType === "counter" && (
            <View className="mb-4 space-y-3">
              <TextInput
                className="rounded-lg border border-gray-300 px-4 py-3"
                placeholder="Unit (e.g., km, pages, liters)"
                value={newHabitUnit}
                onChangeText={setNewHabitUnit}
              />
              <TextInput
                className="rounded-lg border border-gray-300 px-4 py-3"
                placeholder="Daily goal (optional)"
                value={newHabitGoal}
                onChangeText={setNewHabitGoal}
                keyboardType="numeric"
              />
            </View>
          )}

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => {
                setShowAddHabit(false);
                setNewHabitTitle("");
                setNewHabitDescription("");
                setNewHabitUnit("");
                setNewHabitGoal("");
              }}
              className="flex-1 rounded-lg border border-gray-300 py-3"
            >
              <Text className="text-center font-semibold text-gray-600">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAddHabit}
              className="flex-1 rounded-lg bg-blue-500 py-3"
            >
              <Text className="text-center font-semibold text-white">Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
