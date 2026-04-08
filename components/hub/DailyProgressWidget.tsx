import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { CheckCircle2, ChevronRight } from "lucide-react-native";
import { useThemeColors } from "../../hooks/useThemeColors";

interface Props {
  todayTotal: number;
  todayCompleted: number;
  progressPercent: number;
}

export default function DailyProgressWidget({
  todayTotal,
  todayCompleted,
  progressPercent,
}: Props) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push("/(tabs)/tasks")}
      className="rounded-2xl p-5"
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center" style={{ gap: 10 }}>
          <CheckCircle2 size={22} color={colors.primary} />
          <Text
            className="text-lg font-semibold"
            style={{ color: colors.text }}
          >
            {t("hub_todays_progress")}
          </Text>
        </View>
        <ChevronRight size={18} color={colors.textSecondary} />
      </View>

      <View>
        {todayTotal === 0 ? (
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {t("hub_no_tasks_today")}
          </Text>
        ) : (
          <>
            <Text
              className={`text-sm mb-3 ${todayCompleted === todayTotal ? "font-medium" : ""}`}
              style={{
                color:
                  todayCompleted === todayTotal
                    ? colors.primary
                    : colors.textSecondary,
              }}
            >
              {todayCompleted === todayTotal
                ? t("hub_all_tasks_done")
                : t("hub_completed_count", {
                    current: todayCompleted,
                    total: todayTotal,
                  })}
            </Text>

            <View
              className="rounded-full overflow-hidden"
              style={{ height: 8, backgroundColor: colors.border }}
            >
              <View
                style={{
                  width: `${progressPercent}%`,
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
