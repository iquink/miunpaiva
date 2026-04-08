import React from "react";
import { View, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";
import ScreenHeader from "../../components/ui/ScreenHeader";
import { useAuthStore } from "../../store/authStore";
import { useHubStats } from "../../hooks/useHubStats";
import { useHubRewards } from "../../hooks/useHubRewards";
import { useAudioStore } from "../../store/audioStore";
import DailyProgressWidget from "../../components/hub/DailyProgressWidget";
import PersonalGoalsWidget from "../../components/hub/PersonalGoalsWidget";
import SecretBadgesWidget from "../../components/hub/SecretBadgesWidget";
import RPGLevelsWidget from "../../components/hub/RPGLevelsWidget";
import MusicPlayerWidget from "../../components/hub/MusicPlayerWidget";

export default function HubScreen() {
  const { t } = useTranslation("common");
  const colors = useThemeColors();
  const { user } = useAuthStore();
  const { todayTotal, todayCompleted, progressPercent } = useHubStats(user?.id);
  const {
    unreadBadgesCount,
    topRpgStats,
    recentBadges,
    totalGoals,
    completedGoals,
  } = useHubRewards(user?.id);
  const { isPlaying, currentTrackName, player, togglePlayPause } =
    useAudioStore();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title={t("hub")} subtitle={t("hub_subtitle")} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <DailyProgressWidget
          todayTotal={todayTotal}
          todayCompleted={todayCompleted}
          progressPercent={progressPercent}
        />

        <PersonalGoalsWidget
          totalGoals={totalGoals}
          completedGoals={completedGoals}
        />

        <SecretBadgesWidget
          recentBadges={recentBadges}
          unreadBadgesCount={unreadBadgesCount}
        />

        <RPGLevelsWidget topRpgStats={topRpgStats} />

        <MusicPlayerWidget
          isPlaying={isPlaying}
          currentTrackName={currentTrackName}
          player={player}
          togglePlayPause={togglePlayPause}
        />
      </ScrollView>
    </View>
  );
}
