import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import type { Achievement, Habit } from "../db/schema";
import {
  getUserAchievements,
  getUnlockedAchievements,
  getAchievementCriteria,
  createAchievement,
  deleteAchievement as deleteAchievementService,
  isAchievementMissed,
} from "../services/achievementService";
import { getUserHabits } from "../services/habitService";

/**
 * Achievement with status and criteria details
 */
export interface AchievementWithStatus extends Achievement {
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

/**
 * Criterion form structure
 */
export interface CriterionForm {
  habitId: number | null;
  ruleType: "streak" | "total_count" | "sum_value";
  targetValue: string;
  daysPeriod: string;
}

/**
 * Custom hook for managing achievements state and operations
 */
export function useAchievements(userId: number | undefined) {
  const { t } = useTranslation("common");
  const [allAchievements, setAllAchievements] = useState<
    AchievementWithStatus[]
  >([]);
  const [userHabits, setUserHabits] = useState<Habit[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load achievements and habits
  const loadAchievements = useCallback(async () => {
    if (!userId) return;

    try {
      // Fetch user's habits
      const fetchedHabits = await getUserHabits(userId);
      setUserHabits(fetchedHabits);

      // Fetch achievements for current user
      const fetchedAchievements = await getUserAchievements(userId);

      // Fetch unlocked achievements
      const unlocked = await getUnlockedAchievements(userId);

      const unlockedMap = new Map(
        unlocked.map((ua) => [ua.achievementId, ua.unlockedAt]),
      );

      // Count criteria per achievement
      const criteriaCount = new Map<number, number>();
      for (const ach of fetchedAchievements) {
        const count = await getAchievementCriteria(ach.id);
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
        const crits = await getAchievementCriteria(ach.id);

        const criteriaWithTitles = await Promise.all(
          crits.map(async (crit) => {
            const habit = fetchedHabits.find(
              (h) => Number(h.id) === Number(crit.habitId),
            );
            return {
              ruleType: crit.ruleType,
              targetValue: crit.targetValue,
              daysPeriod: crit.daysPeriod,
              habitId: crit.habitId,
              habitTitle: habit?.title || t("unknown_habit"),
            };
          }),
        );
        criteriaMap.set(ach.id, criteriaWithTitles);
      }

      // Build achievements with status
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
  }, [userId, t]);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAchievements();
    setRefreshing(false);
  };

  // Add a new achievement
  const handleAddAchievement = async (achievementData: {
    title: string;
    description: string;
    iconSlug: "medal" | "trophy" | "flower";
    criteria: CriterionForm[];
  }) => {
    if (!userId || !achievementData.title.trim()) {
      Alert.alert(t("error"), t("error_achievement_title_required"));
      return false;
    }

    // Validate criteria
    for (let i = 0; i < achievementData.criteria.length; i++) {
      const c = achievementData.criteria[i];
      if (!c.habitId) {
        Alert.alert(t("error"), t("error_select_habit", { num: i + 1 }));
        return false;
      }
      if (!c.targetValue || parseInt(c.targetValue, 10) <= 0) {
        Alert.alert(t("error"), t("error_target_value", { num: i + 1 }));
        return false;
      }
    }

    try {
      await createAchievement(userId, {
        title: achievementData.title.trim(),
        description: achievementData.description.trim() || "",
        iconSlug: achievementData.iconSlug,
        criteria: achievementData.criteria.map((c) => ({
          habitId: Number(c.habitId!),
          ruleType: c.ruleType,
          targetValue: Number(c.targetValue),
          daysPeriod: c.daysPeriod === "" ? 0 : parseInt(c.daysPeriod, 10),
        })),
      });

      await loadAchievements();
      Alert.alert(t("success"), t("success_achievement_created"));
      return true;
    } catch (error) {
      console.error("Error creating achievement:", error);
      Alert.alert(t("error"), t("error_create_achievement"));
      return false;
    }
  };

  // Delete an achievement
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
              await deleteAchievementService(achievementId);
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

  return {
    allAchievements,
    userHabits,
    refreshing,
    onRefresh,
    handleAddAchievement,
    deleteAchievement,
  };
}
