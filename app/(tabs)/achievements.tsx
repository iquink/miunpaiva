import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import { eq, and, sql } from "drizzle-orm";
import { Award, Lock, Plus, X } from "lucide-react-native";
import { useAuthStore } from "../../store/authStore";
import { db } from "../../db";
import {
  achievements,
  userAchievements,
  habits,
  type Achievement,
  type UserAchievement,
  type Habit,
} from "../../db/schema";

interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlockedAt?: Date;
}

export default function AchievementsScreen() {
  const user = useAuthStore((state) => state.user);
  const [allAchievements, setAllAchievements] = useState<
    AchievementWithStatus[]
  >([]);
  const [userHabits, setUserHabits] = useState<Habit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [ruleType, setRuleType] = useState<
    "streak" | "total_count" | "sum_value"
  >("streak");
  const [targetValue, setTargetValue] = useState("");
  const [linkedHabitId, setLinkedHabitId] = useState<number | null>(null);

  const loadAchievements = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch user's habits
      const fetchedHabits = await db
        .select()
        .from(habits)
        .where(eq(habits.userId, user.id));

      setUserHabits(fetchedHabits);

      // Fetch achievements for current user
      const fetchedAchievements = await db
        .select()
        .from(achievements)
        .where(eq(achievements.userId, user.id));

      // Fetch unlocked achievements
      const unlocked = await db
        .select()
        .from(userAchievements)
        .where(eq(userAchievements.userId, user.id));

      const unlockedMap = new Map(
        unlocked.map((ua) => [ua.achievementId, ua.unlockedAt]),
      );

      const achievementsWithStatus: AchievementWithStatus[] =
        fetchedAchievements.map((ach) => ({
          ...ach,
          unlocked: unlockedMap.has(ach.id),
          unlockedAt: unlockedMap.get(ach.id),
        }));

      setAllAchievements(achievementsWithStatus);
    } catch (error) {
      console.error("Error loading achievements:", error);
      Alert.alert("Error", "Failed to load achievements");
    }
  }, [user]);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAchievements();
    setRefreshing(false);
  };

  const handleAddAchievement = async () => {
    if (!user || !title.trim() || !targetValue) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await db.insert(achievements).values({
        userId: user.id,
        title: title.trim(),
        ruleType,
        targetValue: parseInt(targetValue, 10),
        linkedHabitId,
      });

      // Reset form
      setTitle("");
      setTargetValue("");
      setLinkedHabitId(null);
      setShowAddForm(false);

      await loadAchievements();
    } catch (error) {
      console.error("Error creating achievement:", error);
      Alert.alert("Error", "Failed to create achievement");
    }
  };

  const deleteAchievement = async (achievementId: number) => {
    Alert.alert(
      "Delete Achievement",
      "Are you sure you want to delete this achievement?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await db
                .delete(achievements)
                .where(eq(achievements.id, achievementId));
              await loadAchievements();
            } catch (error) {
              console.error("Error deleting achievement:", error);
              Alert.alert("Error", "Failed to delete achievement");
            }
          },
        },
      ],
    );
  };

  const getRuleTypeLabel = (type: string) => {
    switch (type) {
      case "streak":
        return "Day Streak";
      case "total_count":
        return "Total Count";
      case "sum_value":
        return "Sum Value";
      default:
        return type;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pb-4 pt-12">
        <Text className="text-2xl font-bold text-gray-900">Achievements</Text>
        <Text className="mt-1 text-gray-600">Track your milestones</Text>
      </View>

      {/* Achievements List */}
      <ScrollView
        className="flex-1 px-6 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {allAchievements.length === 0 ? (
          <View className="mt-8 items-center">
            <Text className="text-gray-500">
              No achievements yet. Create your first one!
            </Text>
          </View>
        ) : (
          <>
            {/* Unlocked Achievements */}
            <Text className="mb-3 text-sm font-semibold uppercase text-gray-500">
              Unlocked
            </Text>
            {allAchievements.filter((a) => a.unlocked).length === 0 ? (
              <Text className="mb-4 text-gray-400">
                No unlocked achievements yet
              </Text>
            ) : (
              allAchievements
                .filter((a) => a.unlocked)
                .map((achievement) => (
                  <TouchableOpacity
                    key={achievement.id}
                    onLongPress={() => deleteAchievement(achievement.id)}
                    className="mb-3 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-200 p-4"
                  >
                    <View className="flex-row items-center">
                      <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-yellow-400">
                        <Award color="white" size={24} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-gray-900">
                          {achievement.title}
                        </Text>
                        <Text className="mt-1 text-xs text-gray-600">
                          {getRuleTypeLabel(achievement.ruleType)}:{" "}
                          {achievement.targetValue}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
            )}

            {/* Locked Achievements */}
            <Text className="mb-3 mt-6 text-sm font-semibold uppercase text-gray-500">
              Locked
            </Text>
            {allAchievements.filter((a) => !a.unlocked).length === 0 ? (
              <Text className="text-gray-400">All achievements unlocked!</Text>
            ) : (
              allAchievements
                .filter((a) => !a.unlocked)
                .map((achievement) => (
                  <TouchableOpacity
                    key={achievement.id}
                    onLongPress={() => deleteAchievement(achievement.id)}
                    className="mb-3 rounded-xl bg-gray-200 p-4"
                  >
                    <View className="flex-row items-center">
                      <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-gray-400">
                        <Lock color="white" size={24} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-700">
                          {achievement.title}
                        </Text>
                        <Text className="mt-1 text-xs text-gray-500">
                          {getRuleTypeLabel(achievement.ruleType)}:{" "}
                          {achievement.targetValue}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
            )}
          </>
        )}
      </ScrollView>

      {/* Add Achievement Button */}
      {!showAddForm && (
        <TouchableOpacity
          onPress={() => setShowAddForm(true)}
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg"
        >
          <Plus color="white" size={28} />
        </TouchableOpacity>
      )}

      {/* Add Achievement Form */}
      {showAddForm && (
        <View className="border-t border-gray-200 bg-white p-6">
          <Text className="mb-4 text-lg font-bold text-gray-900">
            New Achievement
          </Text>

          <TextInput
            className="mb-4 rounded-lg border border-gray-300 px-4 py-3"
            placeholder="Achievement title"
            value={title}
            onChangeText={setTitle}
          />

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">
              Rule Type
            </Text>
            <View className="flex-row gap-2">
              {(["streak", "total_count", "sum_value"] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setRuleType(type)}
                  className={`flex-1 rounded-lg border py-2 ${
                    ruleType === type
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <Text
                    className={`text-center text-xs font-semibold ${
                      ruleType === type ? "text-blue-500" : "text-gray-600"
                    }`}
                  >
                    {getRuleTypeLabel(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TextInput
            className="mb-4 rounded-lg border border-gray-300 px-4 py-3"
            placeholder="Target value"
            value={targetValue}
            onChangeText={setTargetValue}
            keyboardType="numeric"
          />

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">
              Link to Habit (Optional)
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row gap-2"
            >
              <TouchableOpacity
                onPress={() => setLinkedHabitId(null)}
                className={`rounded-lg border px-4 py-2 ${
                  linkedHabitId === null
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                <Text
                  className={`text-sm ${
                    linkedHabitId === null ? "text-blue-500" : "text-gray-600"
                  }`}
                >
                  None
                </Text>
              </TouchableOpacity>
              {userHabits.map((habit) => (
                <TouchableOpacity
                  key={habit.id}
                  onPress={() => setLinkedHabitId(habit.id)}
                  className={`rounded-lg border px-4 py-2 ${
                    linkedHabitId === habit.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      linkedHabitId === habit.id
                        ? "text-blue-500"
                        : "text-gray-600"
                    }`}
                  >
                    {habit.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => {
                setShowAddForm(false);
                setTitle("");
                setTargetValue("");
                setLinkedHabitId(null);
              }}
              className="flex-1 rounded-lg border border-gray-300 py-3"
            >
              <Text className="text-center font-semibold text-gray-600">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAddAchievement}
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
