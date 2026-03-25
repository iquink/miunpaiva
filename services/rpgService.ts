import { eq, and, sql } from "drizzle-orm";
import { db } from "../db";
import { logs, habits } from "../db/schema";
import { calculateLevelData, getRankKey } from "./helpers/rpgCalculations";
export type { LevelData } from "./helpers/rpgCalculations";

/**
 * RPG Achievement System
 * Calculates user progression based on completed habit logs
 * Math formula: Level = Math.floor(Math.sqrt(totalCompletedTasks)) + 1
 */

export interface CategoryProgress {
  category: string;
  level: number;
  rankKey: string;
  completedCount: number;
  progressPercent: number;
  nextLevelAt: number;
  lastActivityAt: string | null;
}

/**
 * Get RPG stats for a user grouped by habit category
 * Queries the database and calculates levels on-the-fly
 */
export async function getUserRPGStats(
  userId: number,
): Promise<CategoryProgress[]> {
  try {
    // Query: Join logs and habits, filter by userId and completed status,
    // group by category and count
    const results = await db
      .select({
        category: habits.category,
        completedCount: sql<number>`count(${logs.id})`,
        lastActivityAt: sql<string>`MAX(${logs.date})`,
      })
      .from(logs)
      .innerJoin(habits, eq(logs.habitId, habits.id))
      .where(and(eq(habits.userId, userId), eq(logs.completed, true)))
      .groupBy(habits.category);

    // Map results to CategoryProgress with level calculations
    const categoryProgress: CategoryProgress[] = results
      .filter((r) => r.category !== null)
      .map((result) => {
        const category = result.category || "Uncategorized";
        const completedCount = Number(result.completedCount) || 0;
        const { level, rankKey, progressPercent, nextLevelAt } =
          calculateLevelData(completedCount);

        return {
          category,
          level,
          rankKey,
          completedCount,
          progressPercent,
          nextLevelAt,
          lastActivityAt: result.lastActivityAt ?? null,
        };
      });

    // Sort by level (descending), then by completedCount
    categoryProgress.sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.completedCount - a.completedCount;
    });

    return categoryProgress;
  } catch (error) {
    console.error("Error fetching RPG stats:", error);
    return [];
  }
}
