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

const RPG_CATEGORIES = [
  { emoji: "💪", level: 4, progress: 0.6 },
  { emoji: "🧠", level: 7, progress: 0.35 },
  { emoji: "🧹", level: 2, progress: 0.8 },
  { emoji: "🏃", level: 5, progress: 0.5 },
] as const;

export default function HubScreen() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const colors = useThemeColors();
  const [isPlaying, setIsPlaying] = useState(false);
  const { user } = useAuthStore();
  const { todayTotal, todayCompleted, progressPercent } = useHubStats(user?.id);

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
          onPress={() => router.push("/(tabs)/achievements")}
          className="rounded-2xl p-5"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center" style={{ gap: 10 }}>
              <Trophy size={22} color={colors.warning} />
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.text }}
              >
                {t("hub_new_badges", { count: 2 })}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>

        {/* RPG Levels Widget */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/achievements")}
          className="rounded-2xl p-5"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View className="flex-row justify-around">
            {RPG_CATEGORIES.map((cat, i) => (
              <View
                key={i}
                className="items-center"
                style={{ width: 56, gap: 6 }}
              >
                <Text style={{ fontSize: 28 }}>{cat.emoji}</Text>

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
                      width: `${cat.progress * 100}%`,
                      backgroundColor: colors.accent,
                    }}
                  />
                </View>

                <Text
                  className="text-xs font-semibold"
                  style={{ color: colors.textSecondary }}
                >
                  {"Lv " + cat.level}
                </Text>
              </View>
            ))}
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
