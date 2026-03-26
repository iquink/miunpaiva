import React from "react";
import { View, Text } from "react-native";
import { TrendingUp } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { RPGFeedItem } from "../../hooks/useRewardsFeed";

interface Props {
  item: RPGFeedItem;
}

export default function RPGCard({ item }: Props) {
  const { t } = useTranslation("common");
  const colors = useThemeColors();

  return (
    <View
      className="rounded-xl p-4 mb-3 border"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <View className="flex-row items-center mb-2.5">
        <View
          className="w-[38px] h-[38px] rounded-full justify-center items-center mr-3"
          style={{ backgroundColor: colors.primary + "20" }}
        >
          <TrendingUp color={colors.primary} size={18} />
        </View>

        <View className="flex-1">
          <Text
            className="text-[15px] font-semibold"
            style={{ color: colors.text }}
          >
            {t(item.category)}
          </Text>
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {`Level ${item.level}`}
          </Text>
        </View>

        <View
          className="px-2.5 py-1 rounded-xl"
          style={{ backgroundColor: colors.warning + "20" }}
        >
          <Text className="text-xs font-bold" style={{ color: colors.warning }}>
            {t(item.titleKey)}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-[11px]" style={{ color: colors.textSecondary }}>
            {t("rpg_progress_to_next")}
          </Text>
          <Text className="text-[11px]" style={{ color: colors.textSecondary }}>
            {item.progress}%
          </Text>
        </View>
        <View
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: colors.border }}
        >
          <View
            className="h-1.5 rounded-full"
            style={{
              width: `${item.progress}%`,
              backgroundColor: colors.primary,
            }}
          />
        </View>
      </View>
    </View>
  );
}
