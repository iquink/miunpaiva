import { eq, and, sql } from "drizzle-orm";
import { db } from "../db";
import { logs, habits } from "../db/schema";

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
 * Get rank translation key based on level
 */
function getRankKey(level: number): string {
  if (level >= 25) return "rpg_ranks.legend";
  if (level >= 20) return "rpg_ranks.hero";
  if (level >= 15) return "rpg_ranks.expert";
  if (level >= 10) return "rpg_ranks.master";
  if (level >= 5) return "rpg_ranks.adept";
  return "rpg_ranks.novice";
}

/**
 * Calculate level from completed tasks count
 * Formula: Level = floor(sqrt(completedCount)) + 1
 */
function calculateLevel(completedCount: number): {
  level: number;
  rankKey: string;
  progressPercent: number;
  nextLevelAt: number;
} {
  const level = Math.floor(Math.sqrt(completedCount)) + 1;
  const rankKey = getRankKey(level);

  // Calculate progress to next level
  // Next level requires: (level)^2 completions
  const currentLevelRequirement = Math.pow(level - 1, 2);
  const nextLevelRequirement = Math.pow(level, 2);
  const progressInLevel = completedCount - currentLevelRequirement;
  const levelRange = nextLevelRequirement - currentLevelRequirement;
  const progressPercent = Math.min(
    100,
    Math.floor((progressInLevel / levelRange) * 100),
  );

  return {
    level,
    rankKey,
    progressPercent,
    nextLevelAt: nextLevelRequirement,
  };
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
          calculateLevel(completedCount);

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
