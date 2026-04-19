import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { SecretFeedItem } from "../../hooks/useRewardsFeed";

interface Props {
  item: SecretFeedItem;
}

export default function SecretCard({ item }: Props) {
  const { t } = useTranslation(["rewards", "common"]);
  const colors = useThemeColors();

  const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <View
      className="rounded-xl p-4 mb-3 border"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <View className="flex-row items-start">
        <Text className="text-[30px] mr-3">{item.icon}</Text>
        <View className="flex-1">
          <Text
            className="text-[15px] font-bold mb-1"
            style={{ color: colors.text }}
          >
            {t(item.titleKey)}
          </Text>
          <Text
            className="text-[13px] mb-1.5 leading-[18px]"
            style={{ color: colors.textSecondary }}
          >
            {t(item.descKey)}
          </Text>
          <View
            className="self-start px-2 py-0.5 rounded-lg"
            style={{ backgroundColor: colors.primary + "18" }}
          >
            <Text
              className="text-[11px] font-medium"
              style={{ color: colors.primary }}
            >
              🔓 {dateStr}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
