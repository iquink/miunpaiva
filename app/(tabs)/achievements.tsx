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
import { Award, Lock, Plus, X, Trophy, Flower } from "lucide-react-native";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
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
  missed?: boolean;
  criteria: Array<{
    habitTitle: string;
    ruleType: string;
    targetValue: number;
    daysPeriod: number;
  }>;
}

interface CriterionForm {
  habitId: number | null;
  ruleType: "streak" | "total_count" | "sum_value";
  targetValue: string;
  daysPeriod: string; // Changed to string to allow empty placeholder
}

export default function AchievementsScreen() {
  const { t } = useTranslation();
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
  const [iconSlug, setIconSlug] = useState<"medal" | "trophy" | "flower">(
    "medal",
  );
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

      // Load detailed criteria per achievement
      const criteriaMap = new Map<
        number,
        Array<{
          habitTitle: string;
          ruleType: string;
          targetValue: number;
          daysPeriod: number;
        }>
      >();
      for (const ach of fetchedAchievements) {
        const crits = await db
          .select({
            ruleType: achievementCriteria.ruleType,
            targetValue: achievementCriteria.targetValue,
            daysPeriod: achievementCriteria.daysPeriod,
            habitId: achievementCriteria.habitId,
          })
          .from(achievementCriteria)
          .where(eq(achievementCriteria.achievementId, ach.id));

        const criteriaWithTitles = await Promise.all(
          crits.map(async (crit) => {
            const [hab] = await db
              .select({ title: habits.title })
              .from(habits)
              .where(eq(habits.id, crit.habitId));
            return {
              ...crit,
              habitTitle: hab?.title || t("unknown_habit"),
            };
          }),
        );
        criteriaMap.set(ach.id, criteriaWithTitles);
      }

      // Helper: Check if achievement is missed
      const isAchievementMissed = async (
        achievementId: number,
      ): Promise<boolean> => {
        // Get all criteria for this achievement
        const achCriteria = await db
          .select()
          .from(achievementCriteria)
          .where(eq(achievementCriteria.achievementId, achievementId));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if ANY linked habit has expired
        for (const criterion of achCriteria) {
          const [habit] = await db
            .select()
            .from(habits)
            .where(eq(habits.id, criterion.habitId))
            .limit(1);

          if (!habit) continue;

          // Check if habit has passed its opportunity window
          if (habit.frequency === "once") {
            // One-time habit: check if target date is in the past
            if (habit.targetDate && new Date(habit.targetDate) < today) {
              return true;
            }
          } else if (
            habit.frequency === "daily" ||
            habit.frequency === "weekly"
          ) {
            // Recurring habit: check if end date is in the past
            if (habit.endDate && new Date(habit.endDate) < today) {
              return true;
            }
          }
        }

        return false;
      };

      const achievementsWithStatus: AchievementWithStatus[] = await Promise.all(
        fetchedAchievements.map(async (ach) => {
          const isUnlocked = unlockedMap.has(ach.id);
          const isMissed = !isUnlocked && (await isAchievementMissed(ach.id));

          return {
            ...ach,
            unlocked: isUnlocked,
            unlockedAt: unlockedMap.get(ach.id),
            criteriaCount: criteriaCount.get(ach.id) || 0,
            missed: isMissed,
            criteria: criteriaMap.get(ach.id) || [],
          };
        }),
      );

      setAllAchievements(achievementsWithStatus);
    } catch (error) {
      console.error("Error loading achievements:", error);
      Alert.alert(t("error"), t("error_load_achievements"));
    }
  }, [user, t]);

  // Auto-refresh when tab gains focus
  useFocusEffect(
    useCallback(() => {
      loadAchievements();

      // Cleanup: close modal and reset form when leaving tab
      return () => {
        setShowAddForm(false);
        setTitle("");
        setDescription("");
        setIconSlug("medal");
        setCriteria([
          {
            habitId: null,
            ruleType: "streak",
            targetValue: "",
            daysPeriod: "",
          },
        ]);
      };
    }, [loadAchievements]),
  );

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
      Alert.alert(t("error"), t("error_achievement_title_required"));
      return;
    }

    // Validate criteria
    for (let i = 0; i < criteria.length; i++) {
      const c = criteria[i];
      if (!c.habitId) {
        Alert.alert(t("error"), t("error_select_habit", { num: i + 1 }));
        return;
      }
      if (!c.targetValue || parseInt(c.targetValue, 10) <= 0) {
        Alert.alert(t("error"), t("error_target_value", { num: i + 1 }));
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
          iconSlug: iconSlug,
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
      setIconSlug("medal");
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
      Alert.alert(t("success"), t("success_achievement_created"));
    } catch (error) {
      console.error("Error creating achievement:", error);
      Alert.alert(t("error"), t("error_create_achievement"));
    }
  };

  const deleteAchievement = async (achievementId: number) => {
    Alert.alert(
      t("delete_achievement_title"),
      t("delete_achievement_message"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await db
                .delete(achievements)
                .where(eq(achievements.id, achievementId));
              await loadAchievements();
            } catch (error) {
              console.error("Error deleting achievement:", error);
              Alert.alert(t("error"), t("error_delete_achievement"));
            }
          },
        },
      ],
    );
  };

  const getRuleTypeLabel = (type: string) => {
    switch (type) {
      case "streak":
        return t("streak");
      case "total_count":
        return t("total_count");
      case "sum_value":
        return t("sum_value");
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

  // Render icon component based on slug
  const renderIcon = (slug: string, color: string, size: number) => {
    switch (slug) {
      case "trophy":
        return <Trophy color={color} size={size} />;
      case "flower":
        return <Flower color={color} size={size} />;
      case "medal":
      default:
        return <Award color={color} size={size} />;
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <View className="bg-white dark:bg-slate-800 px-6 pb-4 pt-12">
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("achievements")}
        </Text>
        <Text className="mt-1 text-gray-600 dark:text-gray-400">
          {t("achievements_subtitle")}
        </Text>
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
            <Text className="text-gray-500 dark:text-gray-400">
              {t("no_achievements")}
            </Text>
          </View>
        ) : (
          <>
            {/* Unlocked Achievements */}
            <Text className="mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
              {t("unlocked")}
            </Text>
            {allAchievements.filter((a) => a.unlocked).length === 0 ? (
              <Text className="mb-4 text-gray-400 dark:text-gray-500">
                {t("no_unlocked")}
              </Text>
            ) : (
              allAchievements
                .filter((a) => a.unlocked)
                .map((achievement) => (
                  <TouchableOpacity
                    key={achievement.id}
                    onLongPress={() => deleteAchievement(achievement.id)}
                    className="mb-3 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 p-4"
                  >
                    <View className="flex-row items-center">
                      <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-yellow-400">
                        {renderIcon(achievement.iconSlug, "white", 24)}
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-gray-900 dark:text-gray-100">
                          {achievement.title}
                        </Text>
                        {achievement.description && (
                          <Text className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                            {achievement.description}
                          </Text>
                        )}
                        <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {t("criteria_count", {
                            count: achievement.criteriaCount,
                          })}
                        </Text>
                        {achievement.criteria.length > 0 && (
                          <View className="mt-2">
                            {achievement.criteria.map((crit, idx) => (
                              <Text key={idx} className="text-xs text-gray-500">
                                • {crit.habitTitle}:{" "}
                                {getRuleTypeLabel(crit.ruleType)}{" "}
                                {crit.targetValue}
                                {crit.daysPeriod > 0
                                  ? ` (${crit.daysPeriod} ${t("days")})`
                                  : ""}
                              </Text>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
            )}

            {/* Locked Achievements */}
            <Text className="mb-3 mt-6 text-sm font-semibold uppercase text-gray-500">
              {t("locked")}
            </Text>
            {allAchievements.filter((a) => !a.unlocked && !a.missed).length ===
            0 ? (
              <Text className="text-gray-400">{t("all_unlocked")}</Text>
            ) : (
              allAchievements
                .filter((a) => !a.unlocked && !a.missed)
                .map((achievement) => (
                  <TouchableOpacity
                    key={achievement.id}
                    onLongPress={() => deleteAchievement(achievement.id)}
                    className="mb-3 rounded-xl bg-gray-200 p-4"
                  >
                    <View className="flex-row items-center">
                      <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-gray-400">
                        {renderIcon(achievement.iconSlug, "#9CA3AF", 24)}
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
                          {t("criteria_count_to_complete", {
                            count: achievement.criteriaCount,
                          })}
                        </Text>
                        {achievement.criteria.length > 0 && (
                          <View className="mt-2">
                            {achievement.criteria.map((crit, idx) => (
                              <Text key={idx} className="text-xs text-gray-400">
                                • {crit.habitTitle}:{" "}
                                {getRuleTypeLabel(crit.ruleType)}{" "}
                                {crit.targetValue}
                                {crit.daysPeriod > 0
                                  ? ` (${crit.daysPeriod} ${t("days")})`
                                  : ""}
                              </Text>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
            )}

            {/* Missed Achievements */}
            {allAchievements.filter((a) => a.missed).length > 0 && (
              <>
                <Text className="mb-3 mt-6 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                  {t("missed")}
                </Text>
                {allAchievements
                  .filter((a) => a.missed)
                  .map((achievement) => (
                    <TouchableOpacity
                      key={achievement.id}
                      onLongPress={() => deleteAchievement(achievement.id)}
                      className="mb-3 rounded-xl bg-gray-100 dark:bg-slate-800/50 p-4 opacity-60"
                    >
                      <View className="flex-row items-center">
                        <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-gray-300 dark:bg-slate-700">
                          {renderIcon(achievement.iconSlug, "#9CA3AF", 24)}
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-gray-600 dark:text-gray-400">
                            {achievement.title}
                          </Text>
                          {achievement.description && (
                            <Text className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                              {achievement.description}
                            </Text>
                          )}
                          <Text className="mt-1 text-xs italic text-gray-400 dark:text-gray-500">
                            {t("missed")}
                          </Text>
                          {achievement.criteria.length > 0 && (
                            <View className="mt-2">
                              {achievement.criteria.map((crit, idx) => (
                                <Text
                                  key={idx}
                                  className="text-xs text-gray-400"
                                >
                                  • {crit.habitTitle}:{" "}
                                  {getRuleTypeLabel(crit.ruleType)}{" "}
                                  {crit.targetValue}
                                  {crit.daysPeriod > 0
                                    ? ` (${crit.daysPeriod} ${t("days")})`
                                    : ""}
                                </Text>
                              ))}
                            </View>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
              </>
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
            contentContainerStyle={{ paddingBottom: 150 }}
          >
            <Text className="mb-4 text-lg font-bold text-gray-900">
              {t("new_achievement")}
            </Text>

            <TextInput
              className="mb-4 rounded-lg border border-gray-300 px-4 py-3"
              placeholder={t("achievement_title")}
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              className="mb-4 rounded-lg border border-gray-300 px-4 py-3"
              placeholder={t("achievement_description")}
              value={description}
              onChangeText={setDescription}
              multiline
            />

            {/* Icon Selector */}
            <Text className="mb-2 text-sm font-medium text-gray-700">
              {t("icon")}
            </Text>
            <View className="mb-4 flex-row gap-3">
              {(["medal", "trophy", "flower"] as const).map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => setIconSlug(icon)}
                  className={`flex-1 items-center rounded-lg border p-4 ${
                    iconSlug === icon
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {renderIcon(
                    icon,
                    iconSlug === icon ? "#EAB308" : "#9CA3AF",
                    32,
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text className="mb-2 text-base font-bold text-gray-900">
              {t("criteria_all_must_meet")}
            </Text>

            {criteria.map((criterion, index) => (
              <View
                key={index}
                className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="font-semibold text-gray-700">
                    {t("criterion_num", { num: index + 1 })}
                  </Text>
                  {criteria.length > 1 && (
                    <TouchableOpacity onPress={() => removeCriterion(index)}>
                      <X color="#EF4444" size={20} />
                    </TouchableOpacity>
                  )}
                </View>

                <View className="mb-3">
                  <Text className="mb-2 text-sm font-medium text-gray-700">
                    {t("habit")}
                  </Text>
                  <HabitSelector
                    habits={userHabits}
                    selectedHabitId={criterion.habitId}
                    onSelect={(habitId) =>
                      updateCriterion(index, "habitId", habitId)
                    }
                    excludedHabitIds={getUsedHabitIds(index)}
                    placeholder={t("select_habit")}
                  />
                </View>

                <View className="mb-3">
                  <Text className="mb-2 text-sm font-medium text-gray-700">
                    {t("rule_type")}
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
                    {t("target_value")}
                  </Text>
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-4 py-3"
                    placeholder={t("target_value_placeholder")}
                    value={criterion.targetValue}
                    onChangeText={(val) =>
                      updateCriterion(index, "targetValue", val)
                    }
                    keyboardType="numeric"
                  />
                </View>

                <View>
                  <Text className="mb-2 text-sm font-medium text-gray-700">
                    {t("days_period")}
                  </Text>
                  <TextInput
                    className="rounded-lg border border-gray-300 bg-white px-4 py-3"
                    placeholder={t("days_period_placeholder")}
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
                {t("add_criterion")}
              </Text>
            </TouchableOpacity>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => {
                  setShowAddForm(false);
                  setTitle("");
                  setDescription("");
                  setIconSlug("medal");
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
                  {t("cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddAchievement}
                className="flex-1 rounded-lg bg-blue-500 py-3"
              >
                <Text className="text-center font-semibold text-white">
                  {t("create")}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
