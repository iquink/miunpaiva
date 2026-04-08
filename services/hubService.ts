import { eq, and, count, desc } from "drizzle-orm";
import { db } from "../db";
import {
  userSecretAchievements,
  achievements,
  userAchievements,
} from "../db/schema";
import { getUserRPGStats } from "./rpgService";
import type { CategoryProgress } from "./rpgService";

export type { CategoryProgress };

export interface HubRecentRow {
  id: number;
  secretAchievementId: string;
  isViewed: boolean;
}

export interface HubDashboardData {
  badgeRows: { value: number }[];
  recentRows: HubRecentRow[];
  rpgStats: CategoryProgress[];
  goalRows: { value: number }[];
  completedRows: { value: number }[];
}

export async function getHubDashboardData(
  userId: number,
): Promise<HubDashboardData> {
  const [badgeRows, recentRows, rpgStats, goalRows, completedRows] =
    await Promise.all([
      db
        .select({ value: count() })
        .from(userSecretAchievements)
        .where(
          and(
            eq(userSecretAchievements.userId, userId),
            eq(userSecretAchievements.isViewed, false),
          ),
        ),
      db
        .select({
          id: userSecretAchievements.id,
          secretAchievementId: userSecretAchievements.secretAchievementId,
          isViewed: userSecretAchievements.isViewed,
        })
        .from(userSecretAchievements)
        .where(eq(userSecretAchievements.userId, userId))
        .orderBy(desc(userSecretAchievements.unlockedAt)),
      getUserRPGStats(userId),
      db
        .select({ value: count() })
        .from(achievements)
        .where(eq(achievements.userId, userId)),
      db
        .select({ value: count() })
        .from(userAchievements)
        .where(eq(userAchievements.userId, userId)),
    ]);

  return { badgeRows, recentRows, rpgStats, goalRows, completedRows };
}
