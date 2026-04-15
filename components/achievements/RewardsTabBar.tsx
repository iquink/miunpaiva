import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";

export type RewardsTab = "goals" | "badges" | "levels";

interface Props {
  activeTab: RewardsTab;
  onTabPress: (tab: RewardsTab) => void;
  labels: { goals: string; badges: string; levels: string };
}

export default function RewardsTabBar({
  activeTab,
  onTabPress,
  labels,
}: Props) {
  const colors = useThemeColors();

  const renderTab = (tab: RewardsTab, label: string) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        key={tab}
        onPress={() => onTabPress(tab)}
        className="flex-1 py-2 px-4 rounded-lg"
        style={{
          backgroundColor: isActive ? colors.primary : "transparent",
        }}
      >
        <Text
          className="text-center text-sm"
          style={{
            fontWeight: isActive ? "600" : "400",
            color: isActive ? colors.primaryForeground : colors.textSecondary,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      className="mx-6 mt-2 mb-3 p-1 rounded-[10px] flex-row border"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
    >
      {renderTab("goals", labels.goals)}
      {renderTab("badges", labels.badges)}
      {renderTab("levels", labels.levels)}
    </View>
  );
}
