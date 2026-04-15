import { eq, and, sql, desc, gte } from "drizzle-orm";
import { format, subDays, startOfDay } from "date-fns";
import i18n from "i18next";
import { db } from "../db";
import {
  achievements,
  userAchievements,
  achievementCriteria,
  logs,
  habits,
  type AchievementCriterion,
} from "../db/schema";
import { useToastStore } from "../store/toastStore";

/**
 * Achievement Engine Service (Refactored for Multi-Criteria)
 * Checks if a user has unlocked any achievements based on their habit logs
 */

/**
 * Check all achievements for a user
 * This should be called after any habit log update
 * @param userId - The current user's ID
 */
export async function checkAchievements(userId: number): Promise<void> {
  try {
    // Fetch all locked achievements for this user
    const lockedAchievements = await db
      .select({
        achievement: achievements,
      })
      .from(achievements)
      .leftJoin(
        userAchievements,
        and(
          eq(userAchievements.achievementId, achievements.id),
          eq(userAchievements.userId, userId),
        ),
      )
      .where(
        and(
          eq(achievements.userId, userId),
          sql`${userAchievements.id} IS NULL`, // Not unlocked
        ),
      );

    // Check each locked achievement
    for (const { achievement } of lockedAchievements) {
      const isUnlocked = await checkSingleAchievement(userId, achievement.id);

      if (isUnlocked) {
        // Unlock the achievement
        await db.insert(userAchievements).values({
          userId,
          achievementId: achievement.id,
        });
        useToastStore.getState().showToast({
          icon: "🎯",
          title: i18n.t("toast_goal_reached"),
          description: achievement.title,
          tab: "goals",
        });
        console.log(`🎉 Achievement unlocked: ${achievement.title}`);
      }
    }
  } catch (error) {
    console.error("Error checking achievements:", error);
  }
}

/**
 * Check if a single achievement's ALL criteria are met
 * @param userId - User ID for verification
 * @param achievementId - The achievement to check
 */
async function checkSingleAchievement(
  userId: number,
  achievementId: number,
): Promise<boolean> {
  try {
    // Fetch all criteria for this achievement
    const criteria = await db
      .select()
      .from(achievementCriteria)
      .where(eq(achievementCriteria.achievementId, achievementId));

    // If no criteria exist, achievement cannot be unlocked
    if (criteria.length === 0) {
      return false;
    }

    // ALL criteria must be met
    for (const criterion of criteria) {
      const isMet = await checkCriterion(criterion);
      if (!isMet) {
        return false; // One failed criterion = achievement locked
      }
    }

    // All criteria passed!
    return true;
  } catch (error) {
    console.error("Error checking single achievement:", error);
    return false;
  }
}

/**
 * Check if a single criterion is met
 */
async function checkCriterion(
  criterion: AchievementCriterion,
): Promise<boolean> {
  switch (criterion.ruleType) {
    case "streak":
      return await checkStreakCriterion(criterion);

    case "total_count":
      return await checkTotalCountCriterion(criterion);

    case "sum_value":
      return await checkSumValueCriterion(criterion);

    default:
      return false;
  }
}

/**
 * Check streak criterion: consecutive days with completed logs
 */
async function checkStreakCriterion(
  criterion: AchievementCriterion,
): Promise<boolean> {
  try {
    const { habitId, targetValue } = criterion;

    // Get logs ordered by date descending
    const recentLogs = await db
      .select()
      .from(logs)
      .where(and(eq(logs.habitId, habitId), eq(logs.completed, true)))
      .orderBy(desc(logs.date))
      .limit(targetValue + 10); // Fetch extra to account for gaps

    if (recentLogs.length < targetValue) {
      return false;
    }

    // Check for consecutive days from today backwards
    let currentStreak = 0;
    let expectedDate = format(startOfDay(new Date()), "yyyy-MM-dd");

    for (const log of recentLogs) {
      if (log.date === expectedDate && log.completed) {
        currentStreak++;

        if (currentStreak >= targetValue) {
          return true;
        }

        // Move to previous day
        const prevDay = subDays(new Date(expectedDate), 1);
        expectedDate = format(prevDay, "yyyy-MM-dd");
      } else {
        break; // Streak broken
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking streak criterion:", error);
    return false;
  }
}

/**
 * Check total count criterion: total number of completed logs
 */
async function checkTotalCountCriterion(
  criterion: AchievementCriterion,
): Promise<boolean> {
  try {
    const { habitId, targetValue, daysPeriod } = criterion;

    // Apply date filter if daysPeriod > 0
    if (daysPeriod > 0) {
      const startDate = format(subDays(new Date(), daysPeriod), "yyyy-MM-dd");
      const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(logs)
        .where(
          and(
            eq(logs.habitId, habitId),
            eq(logs.completed, true),
            gte(logs.date, startDate),
          ),
        );

      const count = result?.count || 0;
      return count >= targetValue;
    } else {
      const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(logs)
        .where(and(eq(logs.habitId, habitId), eq(logs.completed, true)));

      const count = result?.count || 0;
      return count >= targetValue;
    }
  } catch (error) {
    console.error("Error checking total count criterion:", error);
    return false;
  }
}

/**
 * Check sum value criterion: sum of log values
 */
async function checkSumValueCriterion(
  criterion: AchievementCriterion,
): Promise<boolean> {
  try {
    const { habitId, targetValue, daysPeriod } = criterion;

    // Apply date filter if daysPeriod > 0
    if (daysPeriod > 0) {
      const startDate = format(subDays(new Date(), daysPeriod), "yyyy-MM-dd");
      const [result] = await db
        .select({ sum: sql<number>`COALESCE(SUM(${logs.value}), 0)` })
        .from(logs)
        .where(and(eq(logs.habitId, habitId), gte(logs.date, startDate)));

      const sum = result?.sum || 0;
      return sum >= targetValue;
    } else {
      const [result] = await db
        .select({ sum: sql<number>`COALESCE(SUM(${logs.value}), 0)` })
        .from(logs)
        .where(eq(logs.habitId, habitId));

      const sum = result?.sum || 0;
      return sum >= targetValue;
    }
  } catch (error) {
    console.error("Error checking sum value criterion:", error);
    return false;
  }
}

/**
 * CRUD Operations for Achievements
 */

/**
 * Get all achievements for a user
 */
export async function getUserAchievements(userId: number) {
  try {
    const fetchedAchievements = await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId));

    return fetchedAchievements;
  } catch (error) {
    console.error("Error fetching achievements:", error);
    throw new Error("Failed to fetch achievements");
  }
}

/**
 * Get unlocked achievements for a user
 */
export async function getUnlockedAchievements(userId: number) {
  try {
    const unlocked = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));

    return unlocked;
  } catch (error) {
    console.error("Error fetching unlocked achievements:", error);
    throw new Error("Failed to fetch unlocked achievements");
  }
}

/**
 * Get criteria for a specific achievement
 */
export async function getAchievementCriteria(achievementId: number) {
  try {
    const criteria = await db
      .select()
      .from(achievementCriteria)
      .where(eq(achievementCriteria.achievementId, achievementId));

    return criteria;
  } catch (error) {
    console.error("Error fetching achievement criteria:", error);
    throw new Error("Failed to fetch achievement criteria");
  }
}

/**
 * Create a new achievement with its criteria
 */
export async function createAchievement(
  userId: number,
  achievementData: {
    title: string;
    description: string;
    iconSlug: "medal" | "trophy" | "flower";
    criteria: Array<{
      habitId: number;
      ruleType: "streak" | "total_count" | "sum_value";
      targetValue: number;
      daysPeriod: number;
    }>;
  },
) {
  try {
    // Insert achievement
    const [newAchievement] = await db
      .insert(achievements)
      .values({
        userId: userId,
        title: achievementData.title,
        description: achievementData.description,
        iconSlug: achievementData.iconSlug,
      })
      .returning();

    // Insert all criteria
    for (const c of achievementData.criteria) {
      await db.insert(achievementCriteria).values({
        achievementId: newAchievement.id,
        habitId: c.habitId,
        ruleType: c.ruleType,
        targetValue: c.targetValue,
        daysPeriod: c.daysPeriod,
      });
    }

    return newAchievement;
  } catch (error) {
    console.error("Error creating achievement:", error);
    throw new Error("Failed to create achievement");
  }
}

/**
 * Delete an achievement
 */
export async function deleteAchievement(achievementId: number) {
  try {
    await db.delete(achievements).where(eq(achievements.id, achievementId));
  } catch (error) {
    console.error("Error deleting achievement:", error);
    throw new Error("Failed to delete achievement");
  }
}

/**
 * Check if an achievement is missed (linked habits expired)
 */
export async function isAchievementMissed(
  achievementId: number,
): Promise<boolean> {
  try {
    // Get all criteria for this achievement
    const achCriteria = await getAchievementCriteria(achievementId);

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
      } else if (habit.frequency === "daily" || habit.frequency === "weekly") {
        // Recurring habit: check if end date is in the past
        if (habit.endDate && new Date(habit.endDate) < today) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking if achievement is missed:", error);
    return false;
  }
}
