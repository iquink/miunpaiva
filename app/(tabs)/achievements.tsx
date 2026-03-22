import { useState, useCallback } from "react";
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
import ScreenHeader from "../../components/ui/ScreenHeader";
import IconButton from "../../components/ui/IconButton";
import AchievementCard from "../../components/achievements/AchievementCard";
import AchievementSection from "../../components/achievements/AchievementSection";
import CreateAchievementForm from "../../components/achievements/CreateAchievementForm";
import RPGStatsList from "../../components/achievements/RPGStatsList";
import React from "react";
import { useThemeColors } from "../../hooks/useThemeColors";

type TabType = "goals" | "rpg";

export default function AchievementsScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const user = useAuthStore((state) => state.user);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("goals");

  // Use the custom hook for achievements management
  const {
    allAchievements,
    userHabits,
    refreshing,
    onRefresh,
    handleAddAchievement: addAchievement,
    deleteAchievement,
  } = useAchievements(user?.id);

  // Auto-refresh when tab gains focus
  useFocusEffect(
    useCallback(() => {
      // Cleanup: close modal when leaving tab
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

    if (success) {
      setShowAddForm(false);
    }
  };

  const unlockedAchievements = allAchievements.filter((a) => a.unlocked);
  const lockedAchievements = allAchievements.filter(
    (a) => !a.unlocked && !a.missed,
  );
  const missedAchievements = allAchievements.filter((a) => a.missed);

  const renderTabButton = (tab: TabType, label: string) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        onPress={() => setActiveTab(tab)}
        style={{
          flex: 1,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
          backgroundColor: isActive ? colors.primary : "transparent",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 14,
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

      {/* Tab Selector */}
      <View
        style={{
          marginHorizontal: 24,
          marginTop: 8,
          marginBottom: 12,
          padding: 4,
          borderRadius: 10,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          flexDirection: "row",
        }}
      >
        {renderTabButton("goals", t("tab_my_goals"))}
        {renderTabButton("rpg", t("tab_rpg_ranks"))}
      </View>

      {/* Conditional Content Based on Active Tab */}
      {activeTab === "goals" ? (
        <>
          {/* Achievements List */}
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
                {/* Unlocked Achievements */}
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

                {/* Locked Achievements */}
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

                {/* Missed Achievements */}
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

          {/* Add Achievement Button - Only visible in "goals" tab */}
          {!showAddForm && (
            <IconButton
              icon={<Plus color="white" size={28} />}
              onPress={() => setShowAddForm(true)}
              className="absolute bottom-6 right-6"
            />
          )}
        </>
      ) : (
        /* RPG Tab Content */
        <RPGStatsList userId={user?.id || 0} />
      )}

      {/* Add Achievement Form */}
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
