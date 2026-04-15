import React, { useState } from "react";
import { View, Text } from "react-native";
import { Headphones } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";
import RelaxTabBar from "../../components/relax/RelaxTabBar";
import MixerPanel from "../../components/relax/MixerPanel";
import PlayerPanel from "../../components/relax/PlayerPanel";

export default function RelaxScreen() {
  const { t } = useTranslation("common");
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<"mixer" | "player">("mixer");

  return (
    <View
      className="flex-1 pt-12"
      style={{ backgroundColor: colors.background }}
    >
      <View className="px-4 mb-4 flex-row items-center">
        <Headphones color={colors.primary} size={28} />
        <Text
          className="ml-3 text-2xl font-bold"
          style={{ color: colors.text }}
        >
          {t("relax")}
        </Text>
      </View>

      <RelaxTabBar activeTab={activeTab} onTabPress={setActiveTab} />

      {activeTab === "mixer" ? <MixerPanel /> : <PlayerPanel />}
    </View>
  );
}
