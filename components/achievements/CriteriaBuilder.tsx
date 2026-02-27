import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { X, Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import HabitSelector from "../habits/HabitSelector";
import Input from "../ui/Input";
import type { CriterionForm } from "../../hooks/useAchievements";
import type { Habit } from "../../db/schema";

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
  const { t } = useTranslation();

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

  return (
    <>
      <Text className="mb-2 text-base font-bold text-gray-900">
        {t("criteria_all_must_meet")}
      </Text>

      {criteria.map((criterion, index) => (
        <View
          key={index}
          className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
        >
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="font-semibold text-gray-700">
              {t("criterion_num", { num: index + 1 })}
            </Text>
            {criteria.length > 1 && (
              <TouchableOpacity onPress={() => onRemove(index)}>
                <X color="#EF4444" size={20} />
              </TouchableOpacity>
            )}
          </View>

          <View className="mb-3">
            <Text className="mb-2 text-sm font-medium text-gray-700">
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
            <Text className="mb-2 text-sm font-medium text-gray-700">
              {t("rule_type")}
            </Text>
            <View className="flex-row gap-2">
              {(["streak", "total_count", "sum_value"] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => onUpdate(index, "ruleType", type)}
                  className={`flex-1 rounded-lg border py-2 ${
                    criterion.ruleType === type
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <Text
                    className={`text-center text-xs font-semibold ${
                      criterion.ruleType === type
                        ? "text-blue-500"
                        : "text-gray-600"
                    }`}
                  >
                    {getRuleTypeLabel(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-3">
            <Text className="mb-2 text-sm font-medium text-gray-700">
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
            <Text className="mb-2 text-sm font-medium text-gray-700">
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
        className="mb-4 flex-row items-center justify-center rounded-lg border border-dashed border-blue-500 py-3"
      >
        <Plus color="#3B82F6" size={20} />
        <Text className="ml-2 font-semibold text-blue-500">
          {t("add_criterion")}
        </Text>
      </TouchableOpacity>
    </>
  );
}
