import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Award, Trophy, Flower } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Input from "../ui/Input";
import Button from "../ui/Button";
import CriteriaBuilder from "./CriteriaBuilder";
import type { CriterionForm } from "../../hooks/useAchievements";
import type { Habit } from "../../db/schema";

interface AchievementFormData {
  title: string;
  description: string;
  iconSlug: "medal" | "trophy" | "flower";
  criteria: CriterionForm[];
}

interface CreateAchievementFormProps {
  userHabits: Habit[];
  onSubmit: (data: AchievementFormData) => void;
  onCancel: () => void;
}

export default function CreateAchievementForm({
  userHabits,
  onSubmit,
  onCancel,
}: CreateAchievementFormProps) {
  const { t } = useTranslation();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [iconSlug, setIconSlug] = useState<"medal" | "trophy" | "flower">(
    "medal",
  );
  const [criteria, setCriteria] = useState<CriterionForm[]>([
    {
      habitId: null,
      ruleType: "streak",
      targetValue: "",
      daysPeriod: "",
    },
  ]);

  const addCriterion = () => {
    setCriteria([
      ...criteria,
      {
        habitId: null,
        ruleType: "streak",
        targetValue: "",
        daysPeriod: "",
      },
    ]);
  };

  const removeCriterion = (index: number) => {
    if (criteria.length > 1) {
      setCriteria(criteria.filter((_, i) => i !== index));
    }
  };

  const updateCriterion = (
    index: number,
    field: keyof CriterionForm,
    value: any,
  ) => {
    const updated = [...criteria];
    updated[index] = { ...updated[index], [field]: value };
    setCriteria(updated);
  };

  const getUsedHabitIds = (currentIndex: number): number[] => {
    return criteria
      .filter((_, i) => i !== currentIndex)
      .map((c) => c.habitId)
      .filter((id): id is number => id !== null);
  };

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

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      iconSlug,
      criteria,
    });
  };

  return (
    <View className="border-t border-gray-200 bg-white">
      <ScrollView
        className="p-6"
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        <Text className="mb-4 text-lg font-bold text-gray-900">
          {t("new_achievement")}
        </Text>

        <Input
          className="mb-4"
          placeholder={t("achievement_title")}
          value={title}
          onChangeText={setTitle}
        />

        <Input
          className="mb-4"
          placeholder={t("achievement_description")}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Icon Selector */}
        <Text className="mb-2 text-sm font-medium text-gray-700">
          {t("icon")}
        </Text>
        <View className="mb-4 flex-row gap-3">
          {(["medal", "trophy", "flower"] as const).map((icon) => (
            <TouchableOpacity
              key={icon}
              onPress={() => setIconSlug(icon)}
              className={`flex-1 items-center rounded-lg border p-4 ${
                iconSlug === icon
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              {renderIcon(icon, iconSlug === icon ? "#EAB308" : "#9CA3AF", 32)}
            </TouchableOpacity>
          ))}
        </View>

        <CriteriaBuilder
          criteria={criteria}
          userHabits={userHabits}
          onAdd={addCriterion}
          onRemove={removeCriterion}
          onUpdate={updateCriterion}
          getUsedHabitIds={getUsedHabitIds}
        />

        <View className="flex-row gap-2">
          <Button variant="secondary" className="flex-1" onPress={onCancel}>
            {t("cancel")}
          </Button>

          <Button className="flex-1" onPress={handleSubmit}>
            {t("create")}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
