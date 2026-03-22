import { eq, and, count } from "drizzle-orm";
import { db } from "../db";
import { habits, logs, userSecretAchievements } from "../db/schema";
import { SECRET_ACHIEVEMENTS } from "../constants/secretAchievements";

/**
 * Background checker that evaluates all locked secret achievements for a user.
 * Safe to call fire-and-forget; never throws to the caller.
 */
export async function checkSecretAchievements(
  userId: number,
  dateStr: string,
): Promise<void> {
  // Fetch already-unlocked secret achievement IDs so we skip them
  const unlocked = await db
    .select({ secretAchievementId: userSecretAchievements.secretAchievementId })
    .from(userSecretAchievements)
    .where(eq(userSecretAchievements.userId, userId));

  const unlockedIds = new Set(unlocked.map((r) => r.secretAchievementId));

  for (const achievement of SECRET_ACHIEVEMENTS) {
    if (unlockedIds.has(achievement.id)) continue;

    let shouldUnlock = false;

    if (achievement.type === "total_preset") {
      const condition = achievement.condition as {
        presetName: string;
        target: number;
      };

      const [result] = await db
        .select({ total: count() })
        .from(logs)
        .innerJoin(habits, eq(logs.habitId, habits.id))
        .where(
          and(
            eq(habits.userId, userId),
            eq(habits.presetName, condition.presetName),
            eq(logs.completed, true),
          ),
        );

      shouldUnlock = (result?.total ?? 0) >= condition.target;
    } else if (achievement.type === "combo_same_day") {
      const condition = achievement.condition as { presetNames: string[] };

      const completedToday = await db
        .select({ presetName: habits.presetName })
        .from(logs)
        .innerJoin(habits, eq(logs.habitId, habits.id))
        .where(
          and(
            eq(habits.userId, userId),
            eq(logs.date, dateStr),
            eq(logs.completed, true),
          ),
        );

      const completedPresetNames = new Set(
        completedToday
          .map((r) => r.presetName)
          .filter((n): n is string => n !== null),
      );

      shouldUnlock = condition.presetNames.every((name) =>
        completedPresetNames.has(name),
      );
    }

    if (shouldUnlock) {
      await db.insert(userSecretAchievements).values({
        userId,
        secretAchievementId: achievement.id,
      });
      console.log(
        `[SecretAchievements] Unlocked: ${achievement.title} (${achievement.icon}) for user ${userId}`,
      );
    }
  }
}
