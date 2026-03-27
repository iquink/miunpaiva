import { eq, and, desc } from "drizzle-orm";
import { db } from "../db";
import {
  habits,
  logs,
  presetCategories,
  presetItems,
  type Habit,
  type Log,
  type PresetCategory,
  type PresetItem,
  type NewHabit,
} from "../db/schema";
import { checkAchievements } from "./achievementService";
import { checkSecretAchievements } from "./secretAchievementEngine";

/**
 * Habit Service
 * Contains all database operations related to habits and logs
 */

/**
 * Fetch all habits for a user
 */
export async function getUserHabits(userId: number): Promise<Habit[]> {
  try {
    const fetchedHabits = await db
      .select()
      .from(habits)
      .where(eq(habits.userId, userId))
      .orderBy(desc(habits.createdAt));

    return fetchedHabits;
  } catch (error) {
    console.error("Error fetching user habits:", error);
    throw new Error("Failed to fetch habits");
  }
}

/**
 * Fetch logs for specific habits on a specific date
 */
export async function getLogsForDate(
  habitIds: number[],
  dateStr: string,
): Promise<Map<number, Log>> {
  try {
    const logsMap = new Map<number, Log>();

    for (const habitId of habitIds) {
      const [log] = await db
        .select()
        .from(logs)
        .where(and(eq(logs.habitId, habitId), eq(logs.date, dateStr)))
        .limit(1);

      if (log) {
        logsMap.set(habitId, log);
      }
    }

    return logsMap;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw new Error("Failed to fetch logs");
  }
}

/**
 * Create a new habit
 */
export async function createHabit(habitData: NewHabit): Promise<Habit> {
  try {
    const [newHabit] = await db.insert(habits).values(habitData).returning();
    return newHabit;
  } catch (error) {
    console.error("Error creating habit:", error);
    throw new Error("Failed to create habit");
  }
}

/**
 * Update a habit's notification state
 */
export async function updateHabitNotification(
  habitId: number,
  notificationId: string | null,
  isEnabled: boolean,
): Promise<void> {
  try {
    await db
      .update(habits)
      .set({ notificationId, isNotificationsEnabled: isEnabled })
      .where(eq(habits.id, habitId));
  } catch (error) {
    console.error("Error updating habit notification:", error);
    throw new Error("Failed to update notification");
  }
}

/**
 * Toggle a boolean habit (create or update log)
 */
export async function toggleBooleanHabitLog(
  habitId: number,
  dateStr: string,
  userId: number,
  existingLog?: Log,
): Promise<Log> {
  try {
    let result: Log;

    if (existingLog) {
      // Update existing log
      const newCompleted = !existingLog.completed;
      await db
        .update(logs)
        .set({ completed: newCompleted })
        .where(eq(logs.id, existingLog.id));

      result = { ...existingLog, completed: newCompleted };
    } else {
      // Create new log
      const [newLog] = await db
        .insert(logs)
        .values({
          habitId: habitId,
          date: dateStr,
          completed: true,
          value: 0,
        })
        .returning();

      result = newLog;
    }

    // Fire-and-forget: check achievements without blocking the UI
    checkAchievements(userId).catch((err) => {
      console.error("[Achievements] Engine error:", err);
    });
    checkSecretAchievements(userId, dateStr).catch((err) => {
      console.error("[SecretAchievements] Engine error:", err);
    });

    return result;
  } catch (error) {
    console.error("Error toggling boolean habit:", error);
    throw new Error("Failed to toggle habit");
  }
}

/**
 * Update a counter habit value (create or update log)
 */
export async function updateCounterHabitLog(
  habitId: number,
  dateStr: string,
  value: number,
  dailyGoal: number | null,
  userId: number,
  existingLog?: Log,
): Promise<Log> {
  try {
    const completed = dailyGoal ? value >= dailyGoal : value > 0;
    let result: Log;

    if (existingLog) {
      // Update existing log
      await db
        .update(logs)
        .set({
          value,
          completed,
        })
        .where(eq(logs.id, existingLog.id));

      result = { ...existingLog, value, completed };
    } else {
      // Create new log
      const [newLog] = await db
        .insert(logs)
        .values({
          habitId: habitId,
          date: dateStr,
          value,
          completed,
        })
        .returning();

      result = newLog;
    }

    // Fire-and-forget: check achievements without blocking the UI
    checkAchievements(userId).catch((err) => {
      console.error("[Achievements] Engine error:", err);
    });
    checkSecretAchievements(userId, dateStr).catch((err) => {
      console.error("[SecretAchievements] Engine error:", err);
    });

    return result;
  } catch (error) {
    console.error("Error updating counter habit:", error);
    throw new Error("Failed to update counter");
  }
}

/**
 * Delete a habit
 */
export async function deleteHabit(habitId: number): Promise<void> {
  try {
    await db.delete(habits).where(eq(habits.id, habitId));
  } catch (error) {
    console.error("Error deleting habit:", error);
    throw new Error("Failed to delete habit");
  }
}

/**
 * Load preset categories
 */
export async function getPresetCategories(): Promise<PresetCategory[]> {
  try {
    const fetchedCategories = await db.select().from(presetCategories);
    return fetchedCategories;
  } catch (error) {
    console.error("Error loading preset categories:", error);
    throw new Error("Failed to load preset categories");
  }
}

/**
 * Load preset items
 */
export async function getPresetItems(): Promise<PresetItem[]> {
  try {
    const fetchedPresets = await db.select().from(presetItems);
    return fetchedPresets;
  } catch (error) {
    console.error("Error loading preset items:", error);
    throw new Error("Failed to load preset items");
  }
}
