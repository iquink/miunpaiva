import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Plus } from "lucide-react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";
import { useAchievements } from "../../hooks/useAchievements";
import { useRewardsFeed } from "../../hooks/useRewardsFeed";
import type { RPGFeedItem, SecretFeedItem } from "../../hooks/useRewardsFeed";
import ScreenHeader from "../../components/ui/ScreenHeader";
import IconButton from "../../components/ui/IconButton";
import AchievementCard from "../../components/achievements/AchievementCard";
import AchievementSection from "../../components/achievements/AchievementSection";
import CreateAchievementForm from "../../components/achievements/CreateAchievementForm";
import RPGCard from "../../components/achievements/RPGCard";
import SecretCard from "../../components/achievements/SecretCard";
import { useThemeColors } from "../../hooks/useThemeColors";
import { markBadgesAsViewed } from "../../services/secretAchievementEngine";

type Tab = "goals" | "badges" | "levels";

export default function RewardsScreen() {
  const { t } = useTranslation("common");
  const colors = useThemeColors();
  const user = useAuthStore((state) => state.user);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("goals");
  const { tab } = useLocalSearchParams<{
    tab?: "goals" | "badges" | "levels";
  }>();

  useEffect(() => {
    if (tab && ["goals", "badges", "levels"].includes(tab)) {
      setActiveTab(tab as Tab);
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

  // Mark badges viewed when the Badges tab is active
  useEffect(() => {
    if (activeTab === "badges" && user?.id) {
      markBadgesAsViewed(user.id).catch(console.error);
    }
  }, [activeTab, user?.id]);

  // Also mark on re-focus while already on Badges tab
  useFocusEffect(
    useCallback(() => {
      if (activeTab === "badges" && user?.id) {
        markBadgesAsViewed(user.id).catch(console.error);
      }
    }, [activeTab, user?.id]),
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        setShowAddForm(false);
      };
    }, []),
  );

  const handleAddAchievementWrapper = async (data: {
    title: string;
    description: string;
    iconSlug: "medal" | "trophy" | "flower";
    criteria: any[];
  }) => {
    const success = await addAchievement(data);
    if (success) setShowAddForm(false);
  };

  const unlockedAchievements = allAchievements.filter((a) => a.unlocked);
  const lockedAchievements = allAchievements.filter(
    (a) => !a.unlocked && !a.missed,
  );
  const missedAchievements = allAchievements.filter((a) => a.missed);

  const renderTab = (tab: Tab, label: string) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        key={tab}
        onPress={() => setActiveTab(tab)}
        className="flex-1 py-2 px-4 rounded-lg"
        style={{
          backgroundColor: isActive ? colors.primary : "transparent",
        }}
      >
        <Text
          className="text-center text-sm"
          style={{
            fontWeight: isActive ? "600" : "400",
            color: isActive ? colors.primaryForeground : colors.textSecondary,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const subtitleMap: Record<Tab, string> = {
    goals: t("achievements_subtitle"),
    badges: t("rpg_subtitle"),
    levels: t("rpg_subtitle"),
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader
        title={t("achievements")}
        subtitle={subtitleMap[activeTab]}
      />

      {/* Segmented control */}
      <View
        className="mx-6 mt-2 mb-3 p-1 rounded-[10px] flex-row border"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        {renderTab("goals", t("tab_goals"))}
        {renderTab("badges", t("filter_secrets"))}
        {renderTab("levels", t("filter_rpg"))}
      </View>

      {/* Goals tab */}
      {activeTab === "goals" && (
        <>
          <ScrollView
            className="flex-1 px-6 py-4"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {allAchievements.length === 0 ? (
              <View className="mt-8 items-center">
                <Text style={{ color: colors.textSecondary }}>
                  {t("no_achievements")}
                </Text>
              </View>
            ) : (
              <>
                <AchievementSection
                  title={t("unlocked")}
                  emptyMessage={t("no_unlocked")}
                  showSection={unlockedAchievements.length > 0}
                >
                  {unlockedAchievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      onLongPress={deleteAchievement}
                    />
                  ))}
                </AchievementSection>

                <AchievementSection
                  title={t("locked")}
                  emptyMessage={t("all_unlocked")}
                  showSection={lockedAchievements.length > 0}
                >
                  {lockedAchievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      onLongPress={deleteAchievement}
                    />
                  ))}
                </AchievementSection>

                {missedAchievements.length > 0 && (
                  <AchievementSection
                    title={t("missed")}
                    emptyMessage=""
                    showSection={true}
                  >
                    {missedAchievements.map((achievement) => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        onLongPress={deleteAchievement}
                      />
                    ))}
                  </AchievementSection>
                )}
              </>
            )}
          </ScrollView>

          {!showAddForm && (
            <IconButton
              icon={<Plus color="white" size={28} />}
              onPress={() => setShowAddForm(true)}
              className="absolute bottom-6 right-6"
            />
          )}
        </>
      )}

      {/* Badges tab */}
      {activeTab === "badges" && (
        <ScrollView
          className="flex-1 px-6"
          refreshControl={
            <RefreshControl
              refreshing={rewardsRefreshing}
              onRefresh={onRewardsRefresh}
            />
          }
        >
          {rewardsLoading ? (
            <View className="mt-8 items-center">
              <Text style={{ color: colors.textSecondary }}>
                {t("loading")}
              </Text>
            </View>
          ) : secretItems.length === 0 ? (
            <View className="mt-8 items-center">
              <Text
                className="text-center leading-[22px]"
                style={{ color: colors.textSecondary }}
              >
                {t("no_rewards")}
              </Text>
            </View>
          ) : (
            <View className="pt-1 pb-6">
              {secretItems.map((item) => (
                <SecretCard key={item.id} item={item} />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Levels tab */}
      {activeTab === "levels" && (
        <ScrollView
          className="flex-1 px-6"
          refreshControl={
            <RefreshControl
              refreshing={rewardsRefreshing}
              onRefresh={onRewardsRefresh}
            />
          }
        >
          {rewardsLoading ? (
            <View className="mt-8 items-center">
              <Text style={{ color: colors.textSecondary }}>
                {t("loading")}
              </Text>
            </View>
          ) : rpgItems.length === 0 ? (
            <View className="mt-8 items-center">
              <Text
                className="text-center leading-[22px]"
                style={{ color: colors.textSecondary }}
              >
                {t("no_rpg_stats")}
              </Text>
            </View>
          ) : (
            <View className="pt-1 pb-6">
              {rpgItems.map((item) => (
                <RPGCard key={item.id} item={item} />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {showAddForm && (
        <CreateAchievementForm
          userHabits={userHabits}
          onSubmit={handleAddAchievementWrapper}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </View>
  );
}
