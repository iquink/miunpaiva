import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { eq, and, count } from "drizzle-orm";
import { db } from "../db";
import { userSecretAchievements } from "../db/schema";
import { getUserRPGStats } from "../services/rpgService";
import type { CategoryProgress } from "../services/rpgService";

export function useHubRewards(userId: number | undefined) {
  const [unreadBadgesCount, setUnreadBadgesCount] = useState(0);
  const [topRpgStats, setTopRpgStats] = useState<CategoryProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (userId === undefined) {
        setLoading(false);
        return;
      }

      let cancelled = false;

      async function fetchData() {
        setLoading(true);
        try {
          const [badgeRows, rpgStats] = await Promise.all([
            db
              .select({ value: count() })
              .from(userSecretAchievements)
              .where(
                and(
                  eq(userSecretAchievements.userId, userId!),
                  eq(userSecretAchievements.isViewed, false),
                ),
              ),
            getUserRPGStats(userId!),
          ]);

          if (cancelled) return;

          setUnreadBadgesCount(badgeRows[0]?.value ?? 0);

          const filtered = rpgStats
            .filter((s) => s.level > 1 || s.progressPercent > 0)
            .sort((a, b) => {
              if (b.level !== a.level) return b.level - a.level;
              return b.progressPercent - a.progressPercent;
            });

          setTopRpgStats(filtered);
        } catch (e) {
          console.error("useHubRewards error:", e);
        } finally {
          if (!cancelled) setLoading(false);
        }
      }

      fetchData();

      return () => {
        cancelled = true;
      };
    }, [userId]),
  );

  return { unreadBadgesCount, topRpgStats, loading };
}
