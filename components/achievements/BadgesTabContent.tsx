import React from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { SecretFeedItem } from "../../hooks/useRewardsFeed";
import SecretCard from "./SecretCard";

interface Props {
  secretItems: SecretFeedItem[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function BadgesTabContent({
  secretItems,
  loading,
  refreshing,
  onRefresh,
}: Props) {
  const { t } = useTranslation("common");
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
      ) : secretItems.length === 0 ? (
        <View className="mt-8 items-center">
          <Text
            className="text-center leading-[22px]"
            style={{ color: colors.textSecondary }}
          >
            {t("no_rewards")}
          </Text>
        </View>
      ) : (
        <View className="pt-1 pb-6">
          {secretItems.map((item) => (
            <SecretCard key={item.id} item={item} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
