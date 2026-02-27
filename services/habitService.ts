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
export async function createHabit(habitData: NewHabit): Promise<void> {
  try {
    await db.insert(habits).values(habitData);
  } catch (error) {
    console.error("Error creating habit:", error);
    throw new Error("Failed to create habit");
  }
}

/**
 * Toggle a boolean habit (create or update log)
 */
export async function toggleBooleanHabitLog(
  habitId: number,
  dateStr: string,
  existingLog?: Log,
): Promise<Log> {
  try {
    if (existingLog) {
      // Update existing log
      const newCompleted = !existingLog.completed;
      await db
        .update(logs)
        .set({ completed: newCompleted })
        .where(eq(logs.id, existingLog.id));

      return { ...existingLog, completed: newCompleted };
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

      return newLog;
    }
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
  existingLog?: Log,
): Promise<Log> {
  try {
    const completed = dailyGoal ? value >= dailyGoal : value > 0;

    if (existingLog) {
      // Update existing log
      await db
        .update(logs)
        .set({
          value,
          completed,
        })
        .where(eq(logs.id, existingLog.id));

      return { ...existingLog, value, completed };
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

      return newLog;
    }
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
