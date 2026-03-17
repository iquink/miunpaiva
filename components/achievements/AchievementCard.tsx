import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Award, Trophy, Flower } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";

interface CriterionDetail {
  habitTitle: string;
  ruleType: string;
  targetValue: number;
  daysPeriod: number;
}

interface Achievement {
  id: number;
  title: string;
  description: string | null;
  iconSlug: string;
  criteriaCount?: number;
  unlocked: boolean;
  missed?: boolean;
  criteria: CriterionDetail[];
}

interface AchievementCardProps {
  achievement: Achievement;
  onLongPress: (id: number) => void;
}

export default function AchievementCard({
  achievement,
  onLongPress,
}: AchievementCardProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();

  const renderIcon = (slug: string, color: string, size: number) => {
    switch (slug) {
      case "trophy":
        return <Trophy color={color} size={size} />;
      case "flower":
        return <Flower color={color} size={size} />;
      case "medal":
      default:
        return <Award color={color} size={size} />;
    }
  };

  const getRuleTypeLabel = (type: string) => {
    switch (type) {
      case "streak":
        return t("streak");
      case "total_count":
        return t("total_count");
      case "sum_value":
        return t("sum_value");
      default:
        return type;
    }
  };

  if (achievement.unlocked) {
    return (
      <TouchableOpacity
        onLongPress={() => onLongPress(achievement.id)}
        className="mb-3 rounded-xl p-4"
        style={{ backgroundColor: colors.warning + "30" }}
      >
        <View className="flex-row items-center">
          <View
            className="mr-3 h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.warning }}
          >
            {renderIcon(achievement.iconSlug, colors.primaryForeground, 24)}
          </View>
          <View className="flex-1">
            <Text
              className="text-base font-bold"
              style={{ color: colors.text }}
            >
              {achievement.title}
            </Text>
            {achievement.description && (
              <Text
                className="mt-1 text-xs"
                style={{ color: colors.textSecondary }}
              >
                {achievement.description}
              </Text>
            )}
            <Text
              className="mt-1 text-xs"
              style={{ color: colors.textSecondary }}
            >
              {t("criteria_count", { count: achievement.criteriaCount || 0 })}
            </Text>
            {achievement.criteria.length > 0 && (
              <View className="mt-2">
                {achievement.criteria.map((crit, idx) => (
                  <Text
                    key={idx}
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    • {crit.habitTitle}: {getRuleTypeLabel(crit.ruleType)}{" "}
                    {crit.targetValue}
                    {crit.daysPeriod > 0
                      ? ` (${crit.daysPeriod} ${t("days")})`
                      : ""}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (achievement.missed === true) {
    return (
      <TouchableOpacity
        onLongPress={() => onLongPress(achievement.id)}
        className="mb-3 rounded-xl p-4 opacity-60"
        style={{ backgroundColor: colors.background }}
      >
        <View className="flex-row items-center">
          <View
            className="mr-3 h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.border }}
          >
            {renderIcon(achievement.iconSlug, colors.textSecondary, 24)}
          </View>
          <View className="flex-1">
            <Text
              className="text-base font-semibold"
              style={{ color: colors.textSecondary }}
            >
              {achievement.title}
            </Text>
            {achievement.description && (
              <Text
                className="mt-1 text-xs"
                style={{ color: colors.textSecondary }}
              >
                {achievement.description}
              </Text>
            )}
            <Text
              className="mt-1 text-xs italic"
              style={{ color: colors.textSecondary }}
            >
              {t("missed")}
            </Text>
            {achievement.criteria.length > 0 && (
              <View className="mt-2">
                {achievement.criteria.map((crit, idx) => (
                  <Text
                    key={idx}
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    • {crit.habitTitle}: {getRuleTypeLabel(crit.ruleType)}{" "}
                    {crit.targetValue}
                    {crit.daysPeriod > 0
                      ? ` (${crit.daysPeriod} ${t("days")})`
                      : ""}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Locked achievement
  return (
    <TouchableOpacity
      onLongPress={() => onLongPress(achievement.id)}
      className="mb-3 rounded-xl p-4"
      style={{ backgroundColor: colors.background }}
    >
      <View className="flex-row items-center">
        <View
          className="mr-3 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.border }}
        >
          {renderIcon(achievement.iconSlug, colors.textSecondary, 24)}
        </View>
        <View className="flex-1">
          <Text
            className="text-base font-semibold"
            style={{ color: colors.textSecondary }}
          >
            {achievement.title}
          </Text>
          {achievement.description && (
            <Text
              className="mt-1 text-xs"
              style={{ color: colors.textSecondary }}
            >
              {achievement.description}
            </Text>
          )}
          <Text
            className="mt-1 text-xs"
            style={{ color: colors.textSecondary }}
          >
            {t("criteria_count_to_complete", {
              count: achievement.criteriaCount || 0,
            })}
          </Text>
          {achievement.criteria.length > 0 && (
            <View className="mt-2">
              {achievement.criteria.map((crit, idx) => (
                <Text
                  key={idx}
                  className="text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  • {crit.habitTitle}: {getRuleTypeLabel(crit.ruleType)}{" "}
                  {crit.targetValue}
                  {crit.daysPeriod > 0
                    ? ` (${crit.daysPeriod} ${t("days")})`
                    : ""}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
