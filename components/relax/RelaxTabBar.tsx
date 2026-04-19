import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";

type RelaxTab = "mixer" | "player";

interface Props {
  activeTab: RelaxTab;
  onTabPress: (tab: RelaxTab) => void;
}

export default function RelaxTabBar({ activeTab, onTabPress }: Props) {
  const { t } = useTranslation(["relax", "common"]);
  const colors = useThemeColors();

  return (
    <View className="flex-row px-4 mb-4" style={{ gap: 8 }}>
      {(["mixer", "player"] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabPress(tab)}
          className="flex-1 py-2 items-center rounded-xl"
          style={{
            backgroundColor:
              activeTab === tab ? colors.primary : colors.surface,
            borderWidth: 1,
            borderColor: activeTab === tab ? colors.primary : colors.border,
          }}
        >
          <Text
            className="font-semibold text-sm"
            style={{
              color: activeTab === tab ? "#fff" : colors.textSecondary,
            }}
          >
            {tab === "mixer" ? t("tab_mixer") : t("tab_music")}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
