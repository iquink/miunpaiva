import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { X, Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import HabitSelector from "../habits/HabitSelector";
import Input from "../ui/Input";
import type { CriterionForm } from "../../hooks/useAchievements";
import type { Habit } from "../../db/schema";
import { useThemeColors } from "../../hooks/useThemeColors";

interface CriteriaBuilderProps {
  criteria: CriterionForm[];
  userHabits: Habit[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof CriterionForm, value: any) => void;
  getUsedHabitIds: (currentIndex: number) => number[];
}

export default function CriteriaBuilder({
  criteria,
  userHabits,
  onAdd,
  onRemove,
  onUpdate,
  getUsedHabitIds,
}: CriteriaBuilderProps) {
  const { t } = useTranslation(["rewards", "common"]);
  const colors = useThemeColors();

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

  const getRuleTypeSubtitle = (type: string): string | null => {
    switch (type) {
      case "total_count":
        return t("total_count_subtitle");
      case "sum_value":
        return t("sum_value_subtitle");
      default:
        return null;
    }
  };

  return (
    <>
      <Text className="mb-2 text-base font-bold" style={{ color: colors.text }}>
        {t("criteria_all_must_meet")}
      </Text>

      {criteria.map((criterion, index) => (
        <View
          key={index}
          className="mb-4 rounded-lg border p-4"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.background,
          }}
        >
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="font-semibold" style={{ color: colors.text }}>
              {t("criterion_num", { num: index + 1 })}
            </Text>
            {criteria.length > 1 && (
              <TouchableOpacity onPress={() => onRemove(index)}>
                <X color={colors.error} size={20} />
              </TouchableOpacity>
            )}
          </View>

          <View className="mb-3">
            <Text
              className="mb-2 text-sm font-medium"
              style={{ color: colors.text }}
            >
              {t("habit")}
            </Text>
            <HabitSelector
              habits={userHabits}
              selectedHabitId={criterion.habitId}
              onSelect={(habitId) => onUpdate(index, "habitId", habitId)}
              excludedHabitIds={getUsedHabitIds(index)}
              placeholder={t("select_habit")}
            />
          </View>

          <View className="mb-3">
            <Text
              className="mb-2 text-sm font-medium"
              style={{ color: colors.text }}
            >
              {t("rule_type")}
            </Text>
            <View className="flex-row gap-2">
              {(["streak", "total_count", "sum_value"] as const).map((type) => {
                const isSelected = criterion.ruleType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => onUpdate(index, "ruleType", type)}
                    className="flex-1 rounded-lg border py-2"
                    style={{
                      backgroundColor: isSelected
                        ? colors.primary + "20"
                        : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    }}
                  >
                    <Text
                      className="text-center text-xs font-semibold"
                      style={{
                        color: isSelected ? colors.primary : colors.text,
                      }}
                    >
                      {getRuleTypeLabel(type)}
                    </Text>
                    {getRuleTypeSubtitle(type) ? (
                      <Text
                        className="text-center mt-0.5"
                        style={{
                          fontSize: 9,
                          lineHeight: 12,
                          color: isSelected
                            ? colors.primary
                            : colors.textSecondary,
                          paddingHorizontal: 4,
                        }}
                        numberOfLines={2}
                      >
                        {getRuleTypeSubtitle(type)}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View className="mb-3">
            <Text
              className="mb-2 text-sm font-medium"
              style={{ color: colors.text }}
            >
              {t("target_value")}
            </Text>
            <Input
              placeholder={t("target_value_placeholder")}
              value={criterion.targetValue}
              onChangeText={(val) => onUpdate(index, "targetValue", val)}
              keyboardType="numeric"
            />
          </View>

          <View>
            <Text
              className="mb-2 text-sm font-medium"
              style={{ color: colors.text }}
            >
              {t("days_period")}
            </Text>
            <Input
              placeholder={t("days_period_placeholder")}
              value={criterion.daysPeriod}
              onChangeText={(val) => onUpdate(index, "daysPeriod", val)}
              keyboardType="numeric"
            />
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={onAdd}
        className="mb-4 flex-row items-center justify-center rounded-lg border border-dashed py-3"
        style={{ borderColor: colors.primary }}
      >
        <Plus color={colors.primary} size={20} />
        <Text className="ml-2 font-semibold" style={{ color: colors.primary }}>
          {t("add_criterion")}
        </Text>
      </TouchableOpacity>
    </>
  );
}
