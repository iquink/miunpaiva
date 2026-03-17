import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";

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
  const colors = useThemeColors();

  const filteredPresets = presets.filter((p) =>
    categories.find(
      (c) => c.id === p.categoryId && c.label === selectedCategory,
    ),
  );

  return (
    <>
      {/* Category Selector */}
      <Text className="mb-2 text-sm font-medium" style={{ color: colors.text }}>
        {t("select_category")}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        <View className="flex-row gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.label;
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => onCategorySelect(category.label)}
                className="rounded-full border px-4 py-2"
                style={{
                  backgroundColor: isSelected
                    ? colors.primary + "20"
                    : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                }}
              >
                <Text
                  className="text-sm font-medium"
                  style={{ color: isSelected ? colors.primary : colors.text }}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Preset Items */}
      {selectedCategory && filteredPresets.length > 0 && (
        <>
          <Text
            className="mb-2 text-sm font-medium"
            style={{ color: colors.text }}
          >
            {t("select_preset")}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row gap-2">
              {filteredPresets.map((preset) => {
                const isSelected = selectedPreset === preset.name;
                return (
                  <TouchableOpacity
                    key={preset.id}
                    onPress={() => onPresetSelect(preset.name)}
                    className="rounded-full border px-4 py-2"
                    style={{
                      backgroundColor: isSelected
                        ? colors.success + "20"
                        : colors.surface,
                      borderColor: isSelected ? colors.success : colors.border,
                    }}
                  >
                    <Text
                      className="text-sm"
                      style={{
                        color: isSelected ? colors.success : colors.text,
                      }}
                    >
                      {preset.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </>
      )}
    </>
  );
}
