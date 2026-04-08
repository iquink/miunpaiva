import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { eq, and, count, desc } from "drizzle-orm";
import { db } from "../db";
import {
  userSecretAchievements,
  achievements,
  userAchievements,
} from "../db/schema";
import { getUserRPGStats } from "../services/rpgService";
import type { CategoryProgress } from "../services/rpgService";
import { SECRET_ACHIEVEMENTS_CATALOG } from "../constants/secretAchievements";

export interface RecentBadge {
  id: number;
  icon: string;
  isViewed: boolean;
}

export function useHubRewards(userId: number | undefined) {
  const [unreadBadgesCount, setUnreadBadgesCount] = useState(0);
  const [topRpgStats, setTopRpgStats] = useState<CategoryProgress[]>([]);
  const [recentBadges, setRecentBadges] = useState<RecentBadge[]>([]);
  const [totalGoals, setTotalGoals] = useState(0);
  const [completedGoals, setCompletedGoals] = useState(0);
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
          const [badgeRows, recentRows, rpgStats, goalRows, completedRows] =
            await Promise.all([
              db
                .select({ value: count() })
                .from(userSecretAchievements)
                .where(
                  and(
                    eq(userSecretAchievements.userId, userId!),
                    eq(userSecretAchievements.isViewed, false),
                  ),
                ),
              db
                .select({
                  id: userSecretAchievements.id,
                  secretAchievementId:
                    userSecretAchievements.secretAchievementId,
                  isViewed: userSecretAchievements.isViewed,
                })
                .from(userSecretAchievements)
                .where(eq(userSecretAchievements.userId, userId!))
                .orderBy(desc(userSecretAchievements.unlockedAt)),
              getUserRPGStats(userId!),
              db
                .select({ value: count() })
                .from(achievements)
                .where(eq(achievements.userId, userId!)),
              db
                .select({ value: count() })
                .from(userAchievements)
                .where(eq(userAchievements.userId, userId!)),
            ]);

          if (cancelled) return;

          setUnreadBadgesCount(badgeRows[0]?.value ?? 0);
          setTotalGoals(goalRows[0]?.value ?? 0);
          setCompletedGoals(completedRows[0]?.value ?? 0);

          const mappedBadges: RecentBadge[] = recentRows.map((row) => {
            const def = SECRET_ACHIEVEMENTS_CATALOG.find(
              (d) => d.id === row.secretAchievementId,
            );
            return {
              id: row.id,
              icon: def?.icon ?? "🏅",
              isViewed: row.isViewed,
            };
          });
          setRecentBadges(mappedBadges);

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

  return {
    unreadBadgesCount,
    topRpgStats,
    recentBadges,
    totalGoals,
    completedGoals,
    loading,
  };
}
