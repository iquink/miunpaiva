import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Award, Lock, Plus, X, Trophy, Flower } from "lucide-react-native";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";
import HabitSelector from "../../components/HabitSelector";
import {
  useAchievements,
  type CriterionForm,
} from "../../hooks/useAchievements";
import ScreenHeader from "../../components/ui/ScreenHeader";
import IconButton from "../../components/ui/IconButton";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import React from "react";

export default function AchievementsScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [showAddForm, setShowAddForm] = useState(false);

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

  // Use the custom hook for achievements management
  const {
    allAchievements,
    userHabits,
    refreshing,
    onRefresh,
    handleAddAchievement: addAchievement,
    deleteAchievement,
  } = useAchievements(user?.id);

  // Auto-refresh when tab gains focus
  useFocusEffect(
    useCallback(() => {
      // Cleanup: close modal and reset form when leaving tab
      return () => {
        setShowAddForm(false);
        setTitle("");
        setDescription("");
        setIconSlug("medal");
        setCriteria([
          {
            habitId: null,
            ruleType: "streak",
            targetValue: "",
            daysPeriod: "",
          },
        ]);
      };
    }, []),
  );

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

  const handleAddAchievementWrapper = async () => {
    const success = await addAchievement({
      title,
      description,
      iconSlug,
      criteria,
    });

    if (success) {
      // Reset form
      setTitle("");
      setDescription("");
      setIconSlug("medal");
      setCriteria([
        {
          habitId: null,
          ruleType: "streak",
          targetValue: "",
          daysPeriod: "",
        },
      ]);
      setShowAddForm(false);
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

  // Get habit IDs already selected in criteria (for duplicate prevention)
  const getUsedHabitIds = (currentIndex: number): number[] => {
    return criteria
      .filter((_, i) => i !== currentIndex)
      .map((c) => c.habitId)
      .filter((id): id is number => id !== null);
  };

  // Render icon component based on slug
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

  return (
    <View className="flex-1 bg-gray-50 dark:bg-slate-900">
      <ScreenHeader
        title={t("achievements")}
        subtitle={t("achievements_subtitle")}
      />

      {/* Achievements List */}
      <ScrollView
        className="flex-1 px-6 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {allAchievements.length === 0 ? (
          <View className="mt-8 items-center">
            <Text className="text-gray-500 dark:text-gray-400">
              {t("no_achievements")}
            </Text>
          </View>
        ) : (
          <>
            {/* Unlocked Achievements */}
            <Text className="mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
              {t("unlocked")}
            </Text>
            {allAchievements.filter((a) => a.unlocked).length === 0 ? (
              <Text className="mb-4 text-gray-400 dark:text-gray-500">
                {t("no_unlocked")}
              </Text>
            ) : (
              allAchievements
                .filter((a) => a.unlocked)
                .map((achievement) => (
                  <TouchableOpacity
                    key={achievement.id}
                    onLongPress={() => deleteAchievement(achievement.id)}
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
                          {t("criteria_count", {
                            count: achievement.criteriaCount,
                          })}
                        </Text>
                        {achievement.criteria.length > 0 && (
                          <View className="mt-2">
                            {achievement.criteria.map((crit, idx) => (
                              <Text key={idx} className="text-xs text-gray-500">
                                • {crit.habitTitle}:{" "}
                                {getRuleTypeLabel(crit.ruleType)}{" "}
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
                ))
            )}

            {/* Locked Achievements */}
            <Text className="mb-3 mt-6 text-sm font-semibold uppercase text-gray-500">
              {t("locked")}
            </Text>
            {allAchievements.filter((a) => !a.unlocked && !a.missed).length ===
            0 ? (
              <Text className="text-gray-400">{t("all_unlocked")}</Text>
            ) : (
              allAchievements
                .filter((a) => !a.unlocked && !a.missed)
                .map((achievement) => (
                  <TouchableOpacity
                    key={achievement.id}
                    onLongPress={() => deleteAchievement(achievement.id)}
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
                            count: achievement.criteriaCount,
                          })}
                        </Text>
                        {achievement.criteria.length > 0 && (
                          <View className="mt-2">
                            {achievement.criteria.map((crit, idx) => (
                              <Text key={idx} className="text-xs text-gray-400">
                                • {crit.habitTitle}:{" "}
                                {getRuleTypeLabel(crit.ruleType)}{" "}
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
                ))
            )}

            {/* Missed Achievements */}
            {allAchievements.filter((a) => a.missed).length > 0 && (
              <>
                <Text className="mb-3 mt-6 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                  {t("missed")}
                </Text>
                {allAchievements
                  .filter((a) => a.missed)
                  .map((achievement) => (
                    <TouchableOpacity
                      key={achievement.id}
                      onLongPress={() => deleteAchievement(achievement.id)}
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
                                <Text
                                  key={idx}
                                  className="text-xs text-gray-400"
                                >
                                  • {crit.habitTitle}:{" "}
                                  {getRuleTypeLabel(crit.ruleType)}{" "}
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
                  ))}
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Add Achievement Button */}
      {!showAddForm && (
        <IconButton
          icon={<Plus color="white" size={28} />}
          onPress={() => setShowAddForm(true)}
          className="absolute bottom-6 right-6"
        />
      )}

      {/* Add Achievement Form */}
      {showAddForm && (
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
                  {renderIcon(
                    icon,
                    iconSlug === icon ? "#EAB308" : "#9CA3AF",
                    32,
                  )}
                </TouchableOpacity>
              ))}
            </View>

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
                    <TouchableOpacity onPress={() => removeCriterion(index)}>
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
                    onSelect={(habitId) =>
                      updateCriterion(index, "habitId", habitId)
                    }
                    excludedHabitIds={getUsedHabitIds(index)}
                    placeholder={t("select_habit")}
                  />
                </View>

                <View className="mb-3">
                  <Text className="mb-2 text-sm font-medium text-gray-700">
                    {t("rule_type")}
                  </Text>
                  <View className="flex-row gap-2">
                    {(["streak", "total_count", "sum_value"] as const).map(
                      (type) => (
                        <TouchableOpacity
                          key={type}
                          onPress={() =>
                            updateCriterion(index, "ruleType", type)
                          }
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
                      ),
                    )}
                  </View>
                </View>

                <View className="mb-3">
                  <Text className="mb-2 text-sm font-medium text-gray-700">
                    {t("target_value")}
                  </Text>
                  <Input
                    placeholder={t("target_value_placeholder")}
                    value={criterion.targetValue}
                    onChangeText={(val) =>
                      updateCriterion(index, "targetValue", val)
                    }
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
                    onChangeText={(val) =>
                      updateCriterion(index, "daysPeriod", val)
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={addCriterion}
              className="mb-4 flex-row items-center justify-center rounded-lg border border-dashed border-blue-500 py-3"
            >
              <Plus color="#3B82F6" size={20} />
              <Text className="ml-2 font-semibold text-blue-500">
                {t("add_criterion")}
              </Text>
            </TouchableOpacity>

            <View className="flex-row gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onPress={() => {
                  setShowAddForm(false);
                  setTitle("");
                  setDescription("");
                  setIconSlug("medal");
                  setCriteria([
                    {
                      habitId: null,
                      ruleType: "streak",
                      targetValue: "",
                      daysPeriod: "",
                    },
                  ]);
                }}
              >
                {t("cancel")}
              </Button>

              <Button className="flex-1" onPress={handleAddAchievementWrapper}>
                {t("create")}
              </Button>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
