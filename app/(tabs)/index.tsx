import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  Trophy,
  Music2,
  Play,
  Pause,
  ChevronRight,
  Target,
} from "lucide-react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import ScreenHeader from "../../components/ui/ScreenHeader";
import { useAuthStore } from "../../store/authStore";
import { useHubStats } from "../../hooks/useHubStats";
import { useHubRewards } from "../../hooks/useHubRewards";
import { useAudioStore } from "../../store/audioStore";

const CATEGORY_EMOJI: Record<string, string> = {
  cat_exercise: "🏃",
  cat_nutrition: "🍎",
  cat_daily_routines: "🚿",
  cat_daily_rhythm: "🌙",
  cat_cleaning: "🧹",
  cat_responsibilities: "📋",
  cat_group_activities: "👥",
};

function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] || "⭐";
}

export default function HubScreen() {
  const router = useRouter();
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
        contentContainerStyle={{
          padding: 20,
          gap: 16,
          pointerEvents: "box-none",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Progress Widget */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/tasks")}
          className="rounded-2xl p-5"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center" style={{ gap: 10 }}>
              <CheckCircle2 size={22} color={colors.primary} />
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.text }}
              >
                {t("hub_todays_progress")}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </View>

          <View>
            {todayTotal === 0 ? (
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                {t("hub_no_tasks_today")}
              </Text>
            ) : (
              <>
                <Text
                  className={`text-sm mb-3 ${todayCompleted === todayTotal ? "font-medium" : ""}`}
                  style={{
                    color:
                      todayCompleted === todayTotal
                        ? colors.primary
                        : colors.textSecondary,
                  }}
                >
                  {todayCompleted === todayTotal
                    ? t("hub_all_tasks_done")
                    : t("hub_completed_count", {
                        current: todayCompleted,
                        total: todayTotal,
                      })}
                </Text>

                <View
                  className="rounded-full overflow-hidden"
                  style={{ height: 8, backgroundColor: colors.border }}
                >
                  <View
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: colors.primary,
                      height: "100%",
                      borderRadius: 9999,
                    }}
                  />
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Personal Goals Widget */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/rewards?tab=goals")}
          className="rounded-2xl p-5"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center" style={{ gap: 10 }}>
              <Target size={22} color={colors.primary} />
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.text }}
              >
                {t("hub_personal_goals")}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </View>

          <View>
            {totalGoals === 0 ? (
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                {t("hub_empty_goals")}
              </Text>
            ) : (
              <>
                <Text
                  className={`text-sm mb-3 ${completedGoals === totalGoals ? "font-medium" : ""}`}
                  style={{
                    color:
                      completedGoals === totalGoals
                        ? colors.primary
                        : colors.textSecondary,
                  }}
                >
                  {completedGoals === totalGoals
                    ? t("hub_all_goals_done")
                    : t("hub_goals_completed_count", {
                        current: completedGoals,
                        total: totalGoals,
                      })}
                </Text>
                <View
                  className="rounded-full overflow-hidden"
                  style={{ height: 8, backgroundColor: colors.border }}
                >
                  <View
                    style={{
                      width: `${Math.round((completedGoals / totalGoals) * 100)}%`,
                      backgroundColor: colors.primary,
                      height: "100%",
                      borderRadius: 9999,
                    }}
                  />
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Secret Badges Widget */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/rewards?tab=badges")}
          className="rounded-2xl p-5"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center" style={{ gap: 10 }}>
              <Trophy
                size={22}
                color={unreadBadgesCount > 0 ? colors.primary : colors.warning}
              />
              <Text
                className="text-lg font-semibold"
                style={{
                  color: unreadBadgesCount > 0 ? colors.primary : colors.text,
                }}
              >
                {unreadBadgesCount > 0
                  ? t("hub_new_badges", { count: unreadBadgesCount })
                  : t("hub_secret_badges")}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </View>

          <View>
            {recentBadges.length === 0 ? (
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                {t("hub_badges_empty_state")}
              </Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={true}
                contentContainerStyle={{ gap: 10, paddingHorizontal: 4 }}
                pointerEvents="box-none"
              >
                {recentBadges.map((badge) => (
                  <View
                    key={badge.id}
                    className="items-center justify-center"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      borderWidth: 2,
                      borderColor: badge.isViewed
                        ? colors.border
                        : colors.primary,
                    }}
                  >
                    <Text style={{ fontSize: 22 }}>{badge.icon}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>

        {/* RPG Levels Widget */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/rewards?tab=levels")}
          className="rounded-2xl p-5"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center" style={{ gap: 10 }}>
              <Trophy size={22} color={colors.accent} />
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.text }}
              >
                {t("hub_rpg_levels")}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </View>

          <View>
            {topRpgStats.length === 0 ? (
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                {t("hub_no_rpg_stats")}
              </Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={true}
                contentContainerStyle={{ gap: 16, paddingHorizontal: 4 }}
                pointerEvents="box-none"
              >
                {topRpgStats.map((stat, i) => (
                  <View
                    key={i}
                    className="items-center"
                    style={{ width: 56, gap: 6 }}
                  >
                    <Text style={{ fontSize: 28 }}>
                      {getCategoryEmoji(stat.category)}
                    </Text>

                    <View
                      className="rounded-full overflow-hidden"
                      style={{
                        height: 4,
                        width: "100%",
                        backgroundColor: colors.border,
                      }}
                    >
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${stat.progressPercent}%`,
                          backgroundColor: colors.accent,
                        }}
                      />
                    </View>

                    <Text
                      className="text-xs font-semibold"
                      style={{ color: colors.textSecondary }}
                    >
                      {`${t("level_short")} ${stat.level}`}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>

        {/* Mini Music Player Widget */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/relax")}
          className="rounded-2xl p-5"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center" style={{ gap: 10 }}>
              <Music2 size={22} color={colors.accent} />
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.text }}
              >
                {t("hub_relaxation")}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </View>

          <View>
            <View className="flex-row items-center justify-between">
              <Text
                className="text-sm flex-1 mr-4"
                style={{ color: colors.textSecondary }}
                numberOfLines={1}
              >
                {!player && !currentTrackName
                  ? t("hub_no_track_selected")
                  : currentTrackName || t("hub_relaxing_ambient")}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  if (!player) {
                    router.push("/(tabs)/relax");
                  } else {
                    togglePlayPause();
                  }
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {isPlaying ? (
                  <Pause size={22} color={colors.primary} />
                ) : (
                  <Play size={22} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
