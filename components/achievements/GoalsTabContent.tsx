import React from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { AchievementWithStatus } from "../../hooks/useAchievements";
import type { Habit } from "../../db/schema";
import AchievementCard from "./AchievementCard";
import AchievementSection from "./AchievementSection";
import CreateAchievementForm from "./CreateAchievementForm";
import IconButton from "../ui/IconButton";

interface Props {
  allAchievements: AchievementWithStatus[];
  unlockedAchievements: AchievementWithStatus[];
  lockedAchievements: AchievementWithStatus[];
  missedAchievements: AchievementWithStatus[];
  refreshing: boolean;
  onRefresh: () => void;
  onDelete: (id: number) => void;
  showAddForm: boolean;
  onShowAddForm: () => void;
  userHabits: Habit[];
  onAddAchievement: (data: {
    title: string;
    description: string;
    iconSlug: "medal" | "trophy" | "flower";
    criteria: any[];
  }) => Promise<void>;
  onCancelForm: () => void;
}

export default function GoalsTabContent({
  allAchievements,
  unlockedAchievements,
  lockedAchievements,
  missedAchievements,
  refreshing,
  onRefresh,
  onDelete,
  showAddForm,
  onShowAddForm,
  userHabits,
  onAddAchievement,
  onCancelForm,
}: Props) {
  const { t } = useTranslation("common");
  const colors = useThemeColors();

  return (
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
                  onLongPress={onDelete}
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
                  onLongPress={onDelete}
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
                    onLongPress={onDelete}
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
          onPress={onShowAddForm}
          className="absolute bottom-6 right-6"
        />
      )}

      {showAddForm && (
        <CreateAchievementForm
          userHabits={userHabits}
          onSubmit={onAddAchievement}
          onCancel={onCancelForm}
        />
      )}
    </>
  );
}
