import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { habits, logs, userSecretAchievements } from "../db/schema";

import {
  SECRET_ACHIEVEMENTS_CATALOG,
  type SecretAchievementDef,
} from "../constants/secretAchievements";

export interface UnlockedSecretAchievement extends SecretAchievementDef {
  unlockedAt: Date;
}

/**
 * Background checker that evaluates all locked secret achievements for a user.
 * Safe to call fire-and-forget; never throws to the caller.
 */
export async function checkSecretAchievements(
  userId: number,
  _dateStr: string,
): Promise<void> {
  // Single query: all completed logs for this user, joined to retrieve presetName
  const rows = await db
    .select({ presetName: habits.presetName })
    .from(logs)
    .innerJoin(habits, eq(logs.habitId, habits.id))
    .where(and(eq(habits.userId, userId), eq(logs.completed, true)));

  // Reduce to a count map: { preset_walking: 17, preset_hydration: 4, ... }
  const presetCounts: Record<string, number> = {};
  for (const row of rows) {
    if (row.presetName) {
      presetCounts[row.presetName] = (presetCounts[row.presetName] ?? 0) + 1;
    }
  }

  // Fetch already-unlocked IDs so we skip them
  const unlocked = await db
    .select({ secretAchievementId: userSecretAchievements.secretAchievementId })
    .from(userSecretAchievements)
    .where(eq(userSecretAchievements.userId, userId));

  const unlockedIds = new Set(unlocked.map((r) => r.secretAchievementId));

  for (const ach of SECRET_ACHIEVEMENTS_CATALOG) {
    if (unlockedIds.has(ach.id)) continue;

    const count = presetCounts[ach.requirement.presetName] ?? 0;
    if (count >= ach.requirement.count) {
      await db.insert(userSecretAchievements).values({
        userId,
        secretAchievementId: ach.id,
      });
      console.log(
        `[SecretAchievements] Unlocked: ${ach.id} (${ach.icon}) for user ${userId}`,
      );
    }
  }
}

/**
 * Returns all secret achievements unlocked by the user, merged with catalog data.
 */
export async function getUnlockedSecretAchievements(
  userId: number,
): Promise<UnlockedSecretAchievement[]> {
  const rows = await db
    .select({
      secretAchievementId: userSecretAchievements.secretAchievementId,
      unlockedAt: userSecretAchievements.unlockedAt,
    })
    .from(userSecretAchievements)
    .where(eq(userSecretAchievements.userId, userId));

  const catalog = new Map(SECRET_ACHIEVEMENTS_CATALOG.map((a) => [a.id, a]));

  return rows
    .map((row) => {
      const base = catalog.get(row.secretAchievementId);
      if (!base) return null;
      return { ...base, unlockedAt: row.unlockedAt };
    })
    .filter((x): x is UnlockedSecretAchievement => x !== null);
}
