import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Target, ChevronRight } from "lucide-react-native";
import { useThemeColors } from "../../hooks/useThemeColors";

interface Props {
  totalGoals: number;
  completedGoals: number;
}

export default function PersonalGoalsWidget({
  totalGoals,
  completedGoals,
}: Props) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push("/(tabs)/rewards?tab=goals")}
      className="rounded-2xl p-5"
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center" style={{ gap: 10 }}>
          <Target size={22} color={colors.primary} />
          <Text
            className="text-lg font-semibold"
            style={{ color: colors.text }}
          >
            {t("hub_personal_goals")}
          </Text>
        </View>
        <ChevronRight size={18} color={colors.textSecondary} />
      </View>

      <View>
        {totalGoals === 0 ? (
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {t("hub_empty_goals")}
          </Text>
        ) : (
          <>
            <Text
              className={`text-sm mb-3 ${completedGoals === totalGoals ? "font-medium" : ""}`}
              style={{
                color:
                  completedGoals === totalGoals
                    ? colors.primary
                    : colors.textSecondary,
              }}
            >
              {completedGoals === totalGoals
                ? t("hub_all_goals_done")
                : t("hub_goals_completed_count", {
                    current: completedGoals,
                    total: totalGoals,
                  })}
            </Text>
            <View
              className="rounded-full overflow-hidden"
              style={{ height: 8, backgroundColor: colors.border }}
            >
              <View
                style={{
                  width: `${Math.round((completedGoals / totalGoals) * 100)}%`,
                  backgroundColor: colors.primary,
                  height: "100%",
                  borderRadius: 9999,
                }}
              />
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}
