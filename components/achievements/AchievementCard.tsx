import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Award, Trophy, Flower } from "lucide-react-native";
import { useTranslation } from "react-i18next";

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
        className="mb-3 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 p-4"
      >
        <View className="flex-row items-center">
          <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-yellow-400">
            {renderIcon(achievement.iconSlug, "white", 24)}
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-900 dark:text-gray-100">
              {achievement.title}
            </Text>
            {achievement.description && (
              <Text className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                {achievement.description}
              </Text>
            )}
            <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t("criteria_count", { count: achievement.criteriaCount || 0 })}
            </Text>
            {achievement.criteria.length > 0 && (
              <View className="mt-2">
                {achievement.criteria.map((crit, idx) => (
                  <Text key={idx} className="text-xs text-gray-500">
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
        className="mb-3 rounded-xl bg-gray-100 dark:bg-slate-800/50 p-4 opacity-60"
      >
        <View className="flex-row items-center">
          <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-gray-300 dark:bg-slate-700">
            {renderIcon(achievement.iconSlug, "#9CA3AF", 24)}
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-600 dark:text-gray-400">
              {achievement.title}
            </Text>
            {achievement.description && (
              <Text className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                {achievement.description}
              </Text>
            )}
            <Text className="mt-1 text-xs italic text-gray-400 dark:text-gray-500">
              {t("missed")}
            </Text>
            {achievement.criteria.length > 0 && (
              <View className="mt-2">
                {achievement.criteria.map((crit, idx) => (
                  <Text key={idx} className="text-xs text-gray-400">
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
      className="mb-3 rounded-xl bg-gray-200 p-4"
    >
      <View className="flex-row items-center">
        <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-gray-400">
          {renderIcon(achievement.iconSlug, "#9CA3AF", 24)}
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-700">
            {achievement.title}
          </Text>
          {achievement.description && (
            <Text className="mt-1 text-xs text-gray-500">
              {achievement.description}
            </Text>
          )}
          <Text className="mt-1 text-xs text-gray-400">
            {t("criteria_count_to_complete", {
              count: achievement.criteriaCount || 0,
            })}
          </Text>
          {achievement.criteria.length > 0 && (
            <View className="mt-2">
              {achievement.criteria.map((crit, idx) => (
                <Text key={idx} className="text-xs text-gray-400">
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
