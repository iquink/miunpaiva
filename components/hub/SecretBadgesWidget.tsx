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
import type { RecentBadge } from "../../hooks/useHubRewards";

interface Props {
  recentBadges: RecentBadge[];
  unreadBadgesCount: number;
}

export default function SecretBadgesWidget({
  recentBadges,
  unreadBadgesCount,
}: Props) {
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
        onPress={() => router.push("/(tabs)/rewards?tab=badges")}
        className="flex-row items-center justify-between mb-3"
      >
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
      </TouchableOpacity>

      <View>
        {recentBadges.length === 0 ? (
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {t("hub_badges_empty_state")}
          </Text>
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={recentBadges}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ gap: 10, paddingHorizontal: 4 }}
            renderItem={({ item: badge }) => (
              <TouchableWithoutFeedback
                onPress={() => router.push(`/(tabs)/rewards?tab=levels`)}
              >
                <View
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
              </TouchableWithoutFeedback>
            )}
          />
        )}
      </View>
    </View>
  );
}
