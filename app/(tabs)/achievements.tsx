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
import { eq, and } from "drizzle-orm";
import { Award, Lock, Plus, X } from "lucide-react-native";
import { useAuthStore } from "../../store/authStore";
import { db } from "../../db";
import {
  achievements,
  userAchievements,
  habits,
  achievementCriteria,
  type Achievement,
  type UserAchievement,
  type Habit,
} from "../../db/schema";
import HabitSelector from "../../components/HabitSelector";
import React from "react";

interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlockedAt?: Date;
  criteriaCount?: number;
}

interface CriterionForm {
  habitId: number | null;
  ruleType: "streak" | "total_count" | "sum_value";
  targetValue: string;
  daysPeriod: string; // Changed to string to allow empty placeholder
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
  const [description, setDescription] = useState("");
  const [criteria, setCriteria] = useState<CriterionForm[]>([
    {
      habitId: null,
      ruleType: "streak",
      targetValue: "",
      daysPeriod: "", // Empty string for placeholder
    },
  ]);

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

      // Count criteria per achievement
      const criteriaCount = new Map<number, number>();
      for (const ach of fetchedAchievements) {
        const count = await db
          .select()
          .from(achievementCriteria)
          .where(eq(achievementCriteria.achievementId, ach.id));
        criteriaCount.set(ach.id, count.length);
      }

      const achievementsWithStatus: AchievementWithStatus[] =
        fetchedAchievements.map((ach) => ({
          ...ach,
          unlocked: unlockedMap.has(ach.id),
          unlockedAt: unlockedMap.get(ach.id),
          criteriaCount: criteriaCount.get(ach.id) || 0,
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

  const addCriterion = () => {
    setCriteria([
      ...criteria,
      {
        habitId: null,
        ruleType: "streak",
        targetValue: "",
        daysPeriod: "", // Empty string
      },
    ]);
  };

  const removeCriterion = (index: number) => {
    if (criteria.length > 1) {
      setCriteria(criteria.filter((_, i) => i !== index));
    }
  };

  const updateCriterion = (
    index: number,
    field: keyof CriterionForm,
    value: any,
  ) => {
    const updated = [...criteria];
    updated[index] = { ...updated[index], [field]: value };
    setCriteria(updated);
  };

  const handleAddAchievement = async () => {
    if (!user || !title.trim()) {
      Alert.alert("Error", "Please enter an achievement title");
      return;
    }

    // Validate criteria
    for (let i = 0; i < criteria.length; i++) {
      const c = criteria[i];
      if (!c.habitId) {
        Alert.alert("Error", `Please select a habit for criterion ${i + 1}`);
        return;
      }
      if (!c.targetValue || parseInt(c.targetValue, 10) <= 0) {
        Alert.alert(
          "Error",
          `Please enter a valid target value for criterion ${i + 1}`,
        );
        return;
      }
    }

    try {
      // Insert achievement
      const [newAchievement] = await db
        .insert(achievements)
        .values({
          userId: user.id,
          title: title.trim(),
          description: description.trim() || null,
        })
        .returning();

      // Insert all criteria
      for (const c of criteria) {
        await db.insert(achievementCriteria).values({
          achievementId: newAchievement.id,
          habitId: c.habitId!,
          ruleType: c.ruleType,
          targetValue: parseInt(c.targetValue, 10),
          daysPeriod: c.daysPeriod === "" ? 0 : parseInt(c.daysPeriod, 10), // Convert empty to 0
        });
      }

      // Reset form
      setTitle("");
      setDescription("");
      setCriteria([
        {
          habitId: null,
          ruleType: "streak",
          targetValue: "",
          daysPeriod: "",
        },
      ]);
      setShowAddForm(false);

      await loadAchievements();
      Alert.alert("Success", "Achievement created!");
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
        return "Streak";
      case "total_count":
        return "Total Count";
      case "sum_value":
        return "Sum Value";
      default:
        return type;
    }
  };

  // Get habit IDs already selected in criteria (for duplicate prevention)
  const getUsedHabitIds = (currentIndex: number): number[] => {
    return criteria
      .filter((_, i) => i !== currentIndex)
      .map((c) => c.habitId)
      .filter((id): id is number => id !== null);
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
                        {achievement.description && (
                          <Text className="mt-1 text-xs text-gray-600">
                            {achievement.description}
                          </Text>
                        )}
                        <Text className="mt-1 text-xs text-gray-500">
                          {achievement.criteriaCount} criteria
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
                        {achievement.description && (
                          <Text className="mt-1 text-xs text-gray-500">
                            {achievement.description}
                          </Text>
                        )}
                        <Text className="mt-1 text-xs text-gray-400">
                          {achievement.criteriaCount} criteria to complete
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
        <View className="border-t border-gray-200 bg-white">
          <ScrollView
            className="p-6"
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            <Text className="mb-4 text-lg font-bold text-gray-900">
              New Achievement
            </Text>

            <TextInput
              className="mb-4 rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Achievement title"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              className="mb-4 rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Description (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text className="mb-2 text-base font-bold text-gray-900">
              Criteria (All must be met)
            </Text>

            {criteria.map((criterion, index) => (
              <View
                key={index}
                className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="font-semibold text-gray-700">
                    Criterion {index + 1}
                  </Text>
                  {criteria.length > 1 && (
                    <TouchableOpacity onPress={() => removeCriterion(index)}>
                      <X color="#EF4444" size={20} />
                    </TouchableOpacity>
                  )}
                </View>

                <View className="mb-3">
                  <Text className="mb-2 text-sm font-medium text-gray-700">
                    Habit
                  </Text>
                  <HabitSelector
                    habits={userHabits}
                    selectedHabitId={criterion.habitId}
                    onSelect={(habitId) =>
                      updateCriterion(index, "habitId", habitId)
                    }
                    excludedHabitIds={getUsedHabitIds(index)}
                    placeholder="Select a habit"
                  />
                </View>

                <View className="mb-3">
                  <Text className="mb-2 text-sm font-medium text-gray-700">
                    Rule Type
                  </Text>
                  <View className="flex-row gap-2">
                    {(["streak", "total_count", "sum_value"] as const).map(
                      (type) => (
                        <TouchableOpacity
                          key={type}
                          onPress={() =>
                            updateCriterion(index, "ruleType", type)
                          }
                          className={`flex-1 rounded-lg border py-2 ${
                            criterion.ruleType === type
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          <Text
                            className={`text-center text-xs font-semibold ${
                              criterion.ruleType === type
                                ? "text-blue-500"
                                : "text-gray-600"
                            }`}
                          >
                            {getRuleTypeLabel(type)}
                          </Text>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                </View>

                <View className="mb-3">
                  <Text className="mb-2 text-sm font-medium text-gray-700">
                    Target Value
                  </Text>
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-4 py-3"
                    placeholder="e.g., 7"
                    value={criterion.targetValue}
                    onChangeText={(val) =>
                      updateCriterion(index, "targetValue", val)
                    }
                    keyboardType="numeric"
                  />
                </View>

                <View>
                  <Text className="mb-2 text-sm font-medium text-gray-700">
                    Days Period
                  </Text>
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-4 py-3"
                    placeholder="Days (Empty = All time)"
                    value={criterion.daysPeriod}
                    onChangeText={(val) =>
                      updateCriterion(index, "daysPeriod", val)
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={addCriterion}
              className="mb-4 flex-row items-center justify-center rounded-lg border border-dashed border-blue-500 py-3"
            >
              <Plus color="#3B82F6" size={20} />
              <Text className="ml-2 font-semibold text-blue-500">
                Add Criterion
              </Text>
            </TouchableOpacity>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => {
                  setShowAddForm(false);
                  setTitle("");
                  setDescription("");
                  setCriteria([
                    {
                      habitId: null,
                      ruleType: "streak",
                      targetValue: "",
                      daysPeriod: "",
                    },
                  ]);
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
                <Text className="text-center font-semibold text-white">
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
