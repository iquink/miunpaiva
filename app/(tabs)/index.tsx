import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  Trophy,
  Music2,
  Play,
  Pause,
  SkipForward,
  ChevronRight,
} from "lucide-react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import ScreenHeader from "../../components/ui/ScreenHeader";
import { useAuthStore } from "../../store/authStore";
import { useHubStats } from "../../hooks/useHubStats";
import { useHubRewards } from "../../hooks/useHubRewards";

const CATEGORY_EMOJI: Record<string, string> = {
  cat_exercise: "💪",
  cat_daily_routines: "🧹",
  cat_daily_rhythm: "🛌",
  cat_nutrition: "🍳",
  cat_cleaning: "🧹",
  cat_responsibilities: "📋",
  cat_group_activities: "🎉",
  exercise: "💪",
  running: "🏃",
  sleep: "🛌",
  nutrition: "🍳",
  hydration: "💧",
  mindfulness: "🧠",
  cleaning: "🧹",
};

function getCategoryEmoji(category: string): string {
  const lower = category.toLowerCase();
  for (const key of Object.keys(CATEGORY_EMOJI)) {
    if (lower.includes(key.replace("cat_", "").replace("_", ""))) {
      return CATEGORY_EMOJI[key];
    }
  }
  return CATEGORY_EMOJI[category] ?? "⭐";
}

export default function HubScreen() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const colors = useThemeColors();
  const [isPlaying, setIsPlaying] = useState(false);
  const { user } = useAuthStore();
  const { todayTotal, todayCompleted, progressPercent } = useHubStats(user?.id);
  const { unreadBadgesCount, topRpgStats } = useHubRewards(user?.id);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title={t("hub")} subtitle={t("hub_subtitle")} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, gap: 16 }}
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

          <Text
            className="text-sm mb-3"
            style={{ color: colors.textSecondary }}
          >
            {t("hub_completed_count", {
              current: todayCompleted,
              total: todayTotal,
            })}
          </Text>

          <View
            className="rounded-full overflow-hidden"
            style={{ height: 8, backgroundColor: colors.border }}
          >
            <View
              className="h-full rounded-full"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: colors.primary,
                height: "100%",
                borderRadius: 9999,
              }}
            />
          </View>
        </TouchableOpacity>

        {/* Badges / Goals Widget */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/rewards")}
          className="rounded-2xl p-5"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View className="flex-row items-center justify-between">
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
                  : t("hub_badges_all_viewed")}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>

        {/* RPG Levels Widget */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/rewards")}
          className="rounded-2xl p-5"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          {topRpgStats.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16, paddingHorizontal: 4 }}
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
                    {`Lv ${stat.level}`}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text
              className="text-sm text-center"
              style={{ color: colors.textSecondary }}
            >
              {t("hub_no_rpg_stats")}
            </Text>
          )}
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
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1" style={{ gap: 10 }}>
              <Music2 size={22} color={colors.accent} />
              <Text
                className="text-lg font-semibold flex-1"
                style={{ color: colors.text }}
                numberOfLines={1}
              >
                {t("hub_relaxing_ambient")}
              </Text>
            </View>

            <View className="flex-row items-center" style={{ gap: 16 }}>
              <TouchableOpacity
                onPress={() => setIsPlaying((p) => !p)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {isPlaying ? (
                  <Pause size={22} color={colors.primary} />
                ) : (
                  <Play size={22} color={colors.primary} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/(tabs)/relax")}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <SkipForward size={22} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
