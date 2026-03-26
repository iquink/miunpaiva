import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { getUserRPGStats, type CategoryProgress } from "../services/rpgService";
import {
  getUnlockedSecretAchievements,
  type UnlockedSecretAchievement,
} from "../services/secretAchievementEngine";

export interface RPGFeedItem {
  id: string;
  type: "rpg";
  titleKey: string;
  category: string;
  level: number;
  progress: number;
  timestamp: number;
}

export interface SecretFeedItem {
  id: string;
  type: "secret";
  titleKey: string;
  descKey: string;
  icon: string;
  timestamp: number;
}

export type FeedItem = RPGFeedItem | SecretFeedItem;

export function useRewardsFeed(userId: number | undefined) {
  const [showRPG, setShowRPG] = useState(true);
  const [showSecrets, setShowSecrets] = useState(true);
  const [rpgStats, setRpgStats] = useState<CategoryProgress[]>([]);
  const [unlockedSecrets, setUnlockedSecrets] = useState<
    UnlockedSecretAchievement[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadRewards = useCallback(async () => {
    if (!userId) return;
    try {
      const [stats, secrets] = await Promise.all([
        getUserRPGStats(userId),
        getUnlockedSecretAchievements(userId),
      ]);
      setRpgStats(stats);
      setUnlockedSecrets(secrets);
    } catch (error) {
      console.error("Error loading rewards:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  /** Kick off a fresh load. Only shows the loading indicator on the first
   * fetch; subsequent focus-triggered refreshes run silently in the background
   * so the existing feed doesn't flicker away. */
  const load = useCallback(() => {
    if (rpgStats.length === 0 && unlockedSecrets.length === 0) {
      setLoading(true);
    }
    loadRewards();
  }, [loadRewards, rpgStats.length, unlockedSecrets.length]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadRewards();
  }, [loadRewards]);

  // Re-fetch whenever this screen comes into focus so data is never stale.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const rpgItems: RPGFeedItem[] = rpgStats.map((cat) => ({
    id: `rpg_${cat.category}`,
    type: "rpg",
    titleKey: cat.rankKey,
    category: cat.category,
    level: cat.level,
    progress: cat.progressPercent,
    timestamp: cat.lastActivityAt ? new Date(cat.lastActivityAt).getTime() : 0,
  }));

  const secretItems: SecretFeedItem[] = unlockedSecrets.map((sec) => ({
    id: `secret_${sec.id}`,
    type: "secret",
    titleKey: `secret_achievements.${sec.id}.title`,
    descKey: `secret_achievements.${sec.id}.description`,
    icon: sec.icon,
    timestamp:
      sec.unlockedAt instanceof Date
        ? sec.unlockedAt.getTime()
        : new Date(sec.unlockedAt).getTime(),
  }));

  const feed: FeedItem[] = [
    ...(showRPG ? rpgItems : []),
    ...(showSecrets ? secretItems : []),
  ].sort((a, b) => b.timestamp - a.timestamp);

  return {
    feed,
    loading,
    refreshing,
    load,
    onRefresh,
    filters: {
      showRPG,
      showSecrets,
      toggleRPG: () => setShowRPG((v) => !v),
      toggleSecrets: () => setShowSecrets((v) => !v),
    },
  };
}
