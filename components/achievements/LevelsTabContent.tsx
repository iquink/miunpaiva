import React from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { RPGFeedItem } from "../../hooks/useRewardsFeed";
import RPGCard from "./RPGCard";

interface Props {
  rpgItems: RPGFeedItem[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function LevelsTabContent({
  rpgItems,
  loading,
  refreshing,
  onRefresh,
}: Props) {
  const { t } = useTranslation(["rewards", "common"]);
  const colors = useThemeColors();

  return (
    <ScrollView
      className="flex-1 px-6"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {loading ? (
        <View className="mt-8 items-center">
          <Text style={{ color: colors.textSecondary }}>{t("loading")}</Text>
        </View>
      ) : rpgItems.length === 0 ? (
        <View className="mt-8 items-center">
          <Text
            className="text-center leading-[22px]"
            style={{ color: colors.textSecondary }}
          >
            {t("no_rpg_stats")}
          </Text>
        </View>
      ) : (
        <View className="pt-1 pb-6">
          {rpgItems.map((item) => (
            <RPGCard key={item.id} item={item} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
