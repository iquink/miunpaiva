import { useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
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
import React from "react";

export default function AchievementsScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [showAddForm, setShowAddForm] = useState(false);

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

  return (
    <View className="flex-1 bg-gray-50 dark:bg-slate-900">
      <ScreenHeader
        title={t("achievements")}
        subtitle={t("achievements_subtitle")}
      />

      {/* Achievements List */}
      <ScrollView
        className="flex-1 px-6 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {allAchievements.length === 0 ? (
          <View className="mt-8 items-center">
            <Text className="text-gray-500 dark:text-gray-400">
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

      {/* Add Achievement Button */}
      {!showAddForm && (
        <IconButton
          icon={<Plus color="white" size={28} />}
          onPress={() => setShowAddForm(true)}
          className="absolute bottom-6 right-6"
        />
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
