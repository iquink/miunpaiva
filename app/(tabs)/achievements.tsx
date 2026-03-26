import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Plus } from "lucide-react-native";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";
import { useAchievements } from "../../hooks/useAchievements";
import { useRewardsFeed } from "../../hooks/useRewardsFeed";
import ScreenHeader from "../../components/ui/ScreenHeader";
import IconButton from "../../components/ui/IconButton";
import AchievementCard from "../../components/achievements/AchievementCard";
import AchievementSection from "../../components/achievements/AchievementSection";
import CreateAchievementForm from "../../components/achievements/CreateAchievementForm";
import RPGCard from "../../components/achievements/RPGCard";
import SecretCard from "../../components/achievements/SecretCard";
import FilterToggle from "../../components/achievements/FilterToggle";
import { useThemeColors } from "../../hooks/useThemeColors";

type MainTab = "goals" | "rewards";

export default function AchievementsScreen() {
  const { t } = useTranslation("common");
  const colors = useThemeColors();
  const user = useAuthStore((state) => state.user);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>("goals");

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
    load: loadRewards,
    onRefresh: onRewardsRefresh,
    filters,
  } = useRewardsFeed(user?.id);

  // Load rewards when switching to the rewards tab
  useEffect(() => {
    if (activeTab === "rewards") {
      loadRewards();
    }
  }, [activeTab, loadRewards]);

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

  // ── Goal sections ─────────────────────────────────────────────
  const unlockedAchievements = allAchievements.filter((a) => a.unlocked);
  const lockedAchievements = allAchievements.filter(
    (a) => !a.unlocked && !a.missed,
  );
  const missedAchievements = allAchievements.filter((a) => a.missed);

  const renderMainTab = (tab: MainTab, label: string) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
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

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader
        title={t("achievements")}
        subtitle={
          activeTab === "goals" ? t("achievements_subtitle") : t("rpg_subtitle")
        }
      />

      {/* Main Tab Selector */}
      <View
        className="mx-6 mt-2 mb-3 p-1 rounded-[10px] flex-row border"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        {renderMainTab("goals", t("tab_goals"))}
        {renderMainTab("rewards", t("tab_rewards"))}
      </View>

      {activeTab === "goals" ? (
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
      ) : (
        /* Rewards Tab */
        <>
          {/* Filter row */}
          <View className="flex-row px-6 pb-3">
            <FilterToggle
              label={t("filter_rpg")}
              active={filters.showRPG}
              onToggle={filters.toggleRPG}
            />
            <FilterToggle
              label={t("filter_secrets")}
              active={filters.showSecrets}
              onToggle={filters.toggleSecrets}
            />
          </View>

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
            ) : feed.length === 0 ? (
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
                {feed.map((item) =>
                  item.type === "rpg" ? (
                    <RPGCard key={item.id} item={item} />
                  ) : (
                    <SecretCard key={item.id} item={item} />
                  ),
                )}
              </View>
            )}
          </ScrollView>
        </>
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
