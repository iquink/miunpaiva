import React, { useState, useCallback, useEffect } from "react";
import { View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";
import { useAchievements } from "../../hooks/useAchievements";
import { useRewardsFeed } from "../../hooks/useRewardsFeed";
import type { RPGFeedItem, SecretFeedItem } from "../../hooks/useRewardsFeed";
import ScreenHeader from "../../components/ui/ScreenHeader";
import { useThemeColors } from "../../hooks/useThemeColors";
import { markBadgesAsViewed } from "../../services/secretAchievementEngine";
import RewardsTabBar, {
  type RewardsTab,
} from "../../components/achievements/RewardsTabBar";
import GoalsTabContent from "../../components/achievements/GoalsTabContent";
import BadgesTabContent from "../../components/achievements/BadgesTabContent";
import LevelsTabContent from "../../components/achievements/LevelsTabContent";

export default function RewardsScreen() {
  const { t } = useTranslation("common");
  const colors = useThemeColors();
  const user = useAuthStore((state) => state.user);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<RewardsTab>("goals");
  const { tab } = useLocalSearchParams<{ tab?: RewardsTab }>();

  useEffect(() => {
    if (tab && ["goals", "badges", "levels"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [tab]);

  const {
    allAchievements,
    userHabits,
    refreshing,
    onRefresh,
    handleAddAchievement: addAchievement,
    deleteAchievement,
  } = useAchievements(user?.id);

  const {
    feed,
    loading: rewardsLoading,
    refreshing: rewardsRefreshing,
    onRefresh: onRewardsRefresh,
  } = useRewardsFeed(user?.id);

  const rpgItems = feed.filter(
    (item): item is RPGFeedItem => item.type === "rpg",
  );
  const secretItems = feed.filter(
    (item): item is SecretFeedItem => item.type === "secret",
  );

  useEffect(() => {
    if (activeTab === "badges" && user?.id) {
      markBadgesAsViewed(user.id).catch(console.error);
    }
  }, [activeTab, user?.id]);

  useEffect(() => {
    setShowAddForm(false);
  }, [activeTab]);

  useFocusEffect(
    useCallback(() => {
      if (activeTab === "badges" && user?.id) {
        markBadgesAsViewed(user.id).catch(console.error);
      }
    }, [activeTab, user?.id]),
  );

  useFocusEffect(
    useCallback(() => {
      return () => setShowAddForm(false);
    }, []),
  );

  const handleAddAchievement = async (data: {
    title: string;
    description: string;
    iconSlug: "medal" | "trophy" | "flower";
    criteria: any[];
  }) => {
    const success = await addAchievement(data);
    if (success) setShowAddForm(false);
  };

  const subtitleMap: Record<RewardsTab, string> = {
    goals: t("achievements_subtitle"),
    badges: t("rpg_subtitle"),
    levels: t("rpg_subtitle"),
  };

  const unlockedAchievements = allAchievements.filter((a) => a.unlocked);
  const lockedAchievements = allAchievements.filter(
    (a) => !a.unlocked && !a.missed,
  );
  const missedAchievements = allAchievements.filter((a) => a.missed);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader
        title={t("achievements")}
        subtitle={subtitleMap[activeTab]}
      />

      <RewardsTabBar
        activeTab={activeTab}
        onTabPress={setActiveTab}
        labels={{
          goals: t("tab_goals"),
          badges: t("filter_secrets"),
          levels: t("filter_rpg"),
        }}
      />

      {activeTab === "goals" && (
        <GoalsTabContent
          allAchievements={allAchievements}
          unlockedAchievements={unlockedAchievements}
          lockedAchievements={lockedAchievements}
          missedAchievements={missedAchievements}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onDelete={deleteAchievement}
          showAddForm={showAddForm}
          onShowAddForm={() => setShowAddForm(true)}
          userHabits={userHabits}
          onAddAchievement={handleAddAchievement}
          onCancelForm={() => setShowAddForm(false)}
        />
      )}

      {activeTab === "badges" && (
        <BadgesTabContent
          secretItems={secretItems}
          loading={rewardsLoading}
          refreshing={rewardsRefreshing}
          onRefresh={onRewardsRefresh}
        />
      )}

      {activeTab === "levels" && (
        <LevelsTabContent
          rpgItems={rpgItems}
          loading={rewardsLoading}
          refreshing={rewardsRefreshing}
          onRefresh={onRewardsRefresh}
        />
      )}
    </View>
  );
}
