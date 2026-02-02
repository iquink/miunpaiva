import { eq, and, sql, desc, gte } from "drizzle-orm";
import { format, subDays, startOfDay } from "date-fns";
import { db } from "../db";
import {
  achievements,
  userAchievements,
  logs,
  habits,
  type Achievement,
} from "../db/schema";

/**
 * Achievement Engine Service
 * Checks if a user has unlocked any achievements based on their habit logs
 */

/**
 * Check achievements for a specific user and habit
 * @param userId - The current user's ID
 * @param habitId - The habit ID that was just updated
 */
export async function checkAchievements(
  userId: number,
  habitId: number,
): Promise<void> {
  try {
    // Fetch all locked achievements for this user and habit
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
          eq(achievements.linkedHabitId, habitId),
          sql`${userAchievements.id} IS NULL`, // Not unlocked
        ),
      );

    // Check each achievement
    for (const { achievement } of lockedAchievements) {
      const isUnlocked = await checkSingleAchievement(
        userId,
        habitId,
        achievement,
      );

      if (isUnlocked) {
        // Unlock the achievement
        await db.insert(userAchievements).values({
          userId,
          achievementId: achievement.id,
        });

        console.log(`Achievement unlocked: ${achievement.title}`);
      }
    }
  } catch (error) {
    console.error("Error checking achievements:", error);
  }
}

/**
 * Check if a single achievement condition is met
 */
async function checkSingleAchievement(
  userId: number,
  habitId: number,
  achievement: Achievement,
): Promise<boolean> {
  switch (achievement.ruleType) {
    case "streak":
      return await checkStreakAchievement(habitId, achievement.targetValue);

    case "total_count":
      return await checkTotalCountAchievement(
        habitId,
        achievement.targetValue,
        achievement.daysPeriod,
      );

    case "sum_value":
      return await checkSumValueAchievement(
        habitId,
        achievement.targetValue,
        achievement.daysPeriod,
      );

    default:
      return false;
  }
}

/**
 * Check streak achievement: consecutive days with completed logs
 */
async function checkStreakAchievement(
  habitId: number,
  targetDays: number,
): Promise<boolean> {
  // Get logs ordered by date descending
  const recentLogs = await db
    .select()
    .from(logs)
    .where(and(eq(logs.habitId, habitId), eq(logs.completed, true)))
    .orderBy(desc(logs.date))
    .limit(targetDays + 10); // Fetch extra to account for gaps

  if (recentLogs.length < targetDays) {
    return false;
  }

  // Check for consecutive days
  let currentStreak = 0;
  let expectedDate = format(startOfDay(new Date()), "yyyy-MM-dd");

  for (const log of recentLogs) {
    if (log.date === expectedDate && log.completed) {
      currentStreak++;

      if (currentStreak >= targetDays) {
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
}

/**
 * Check total count achievement: total number of completed logs
 */
async function checkTotalCountAchievement(
  habitId: number,
  targetCount: number,
  daysPeriod: number,
): Promise<boolean> {
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
    return count >= targetCount;
  } else {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(logs)
      .where(and(eq(logs.habitId, habitId), eq(logs.completed, true)));

    const count = result?.count || 0;
    return count >= targetCount;
  }
}

/**
 * Check sum value achievement: sum of log values
 */
async function checkSumValueAchievement(
  habitId: number,
  targetSum: number,
  daysPeriod: number,
): Promise<boolean> {
  // Apply date filter if daysPeriod > 0
  if (daysPeriod > 0) {
    const startDate = format(subDays(new Date(), daysPeriod), "yyyy-MM-dd");
    const [result] = await db
      .select({ sum: sql<number>`COALESCE(SUM(${logs.value}), 0)` })
      .from(logs)
      .where(and(eq(logs.habitId, habitId), gte(logs.date, startDate)));

    const sum = result?.sum || 0;
    return sum >= targetSum;
  } else {
    const [result] = await db
      .select({ sum: sql<number>`COALESCE(SUM(${logs.value}), 0)` })
      .from(logs)
      .where(eq(logs.habitId, habitId));

    const sum = result?.sum || 0;
    return sum >= targetSum;
  }
}

/**
 * Check all achievements for a user (useful for periodic checks)
 */
export async function checkAllUserAchievements(userId: number): Promise<void> {
  try {
    // Get all user's habits
    const userHabits = await db
      .select()
      .from(habits)
      .where(eq(habits.userId, userId));

    // Check achievements for each habit
    for (const habit of userHabits) {
      await checkAchievements(userId, habit.id);
    }
  } catch (error) {
    console.error("Error checking all achievements:", error);
  }
}
