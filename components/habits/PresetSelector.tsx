import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

interface Category {
  id: number;
  label: string;
}

interface Preset {
  id: number;
  name: string;
  categoryId: number;
}

interface PresetSelectorProps {
  categories: Category[];
  presets: Preset[];
  selectedCategory: string | null;
  selectedPreset: string | null;
  onCategorySelect: (category: string) => void;
  onPresetSelect: (preset: string) => void;
}

export default function PresetSelector({
  categories,
  presets,
  selectedCategory,
  selectedPreset,
  onCategorySelect,
  onPresetSelect,
}: PresetSelectorProps) {
  const { t } = useTranslation();

  const filteredPresets = presets.filter((p) =>
    categories.find(
      (c) => c.id === p.categoryId && c.label === selectedCategory,
    ),
  );

  return (
    <>
      {/* Category Selector */}
      <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {t("select_category")}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        <View className="flex-row gap-2">
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => onCategorySelect(category.label)}
              className={`rounded-full border px-4 py-2 ${
                selectedCategory === category.label
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                  : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedCategory === category.label
                    ? "text-blue-500 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Preset Items */}
      {selectedCategory && filteredPresets.length > 0 && (
        <>
          <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("select_preset")}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row gap-2">
              {filteredPresets.map((preset) => (
                <TouchableOpacity
                  key={preset.id}
                  onPress={() => onPresetSelect(preset.name)}
                  className={`rounded-full border px-4 py-2 ${
                    selectedPreset === preset.name
                      ? "border-green-500 bg-green-50 dark:bg-green-900"
                      : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selectedPreset === preset.name
                        ? "text-green-600 dark:text-green-300"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {preset.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </>
      )}
    </>
  );
}
