import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Trophy, ChevronRight } from "lucide-react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { CategoryProgress } from "../../services/rpgService";

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

interface Props {
  topRpgStats: CategoryProgress[];
}

export default function RPGLevelsWidget({ topRpgStats }: Props) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const colors = useThemeColors();

  return (
    <View
      className="rounded-2xl p-5"
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push("/(tabs)/rewards?tab=levels")}
        className="flex-row items-center justify-between mb-3"
      >
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
      </TouchableOpacity>

      <View>
        {topRpgStats.length === 0 ? (
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {t("hub_no_rpg_stats")}
          </Text>
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={topRpgStats}
            keyExtractor={(item) => item.category}
            contentContainerStyle={{ gap: 16, paddingHorizontal: 4 }}
            renderItem={({ item: stat }) => (
              <TouchableWithoutFeedback
                onPress={() => router.push(`/(tabs)/rewards?tab=levels`)}
              >
                <View className="items-center" style={{ width: 56, gap: 6 }}>
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
              </TouchableWithoutFeedback>
            )}
          />
        )}
      </View>
    </View>
  );
}
