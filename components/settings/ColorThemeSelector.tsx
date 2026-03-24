import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Check } from "lucide-react-native";
import Card from "../ui/Card";
import { useTranslation } from "react-i18next";
import { useThemeStore, type ThemeName } from "../../store/themeStore";
import { useThemeColors } from "../../hooks/useThemeColors";

// Hard-coded preview colors (ensure previews represent each theme regardless of the current theme)
const THEME_PREVIEWS: Record<
  ThemeName,
  { bg: string; surface: string; primary: string }
> = {
  default: { bg: "#f9fafb", surface: "#ffffff", primary: "#3b82f6" },
  forest: { bg: "#f0fdf4", surface: "#ffffff", primary: "#22c55e" },
  ocean: { bg: "#f0f9ff", surface: "#ffffff", primary: "#0ea5e9" },
  coffee: { bg: "#fef3c7", surface: "#ffffff", primary: "#d97706" },
};

const THEMES: { id: ThemeName; name: string }[] = [
  { id: "default", name: "Default" },
  { id: "forest", name: "Forest" },
  { id: "ocean", name: "Ocean" },
  { id: "coffee", name: "Coffee" },
];

export default function ColorThemeSelector() {
  // 1. Connect directly to our theme store
  const { activeTheme, setTheme } = useThemeStore();
  // 2. Get current colors for styling the card
  const colors = useThemeColors();
  // 3. Translation helper
  const { t } = useTranslation('common');

  return (
    <Card
      className="mb-4"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <Text
        className="mb-3 text-base font-semibold"
        style={{ color: colors.text }}
      >
        {t("color_theme")}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {THEMES.map((theme) => {
          const isSelected = activeTheme === theme.id;
          const preview = THEME_PREVIEWS[theme.id];

          return (
            <TouchableOpacity
              key={theme.id}
              onPress={() => setTheme(theme.id)}
              className="mr-3"
            >
              <View
                className="h-24 w-20 overflow-hidden rounded-lg border"
                style={{
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                }}
              >
                {/* Preview color blocks */}
                <View className="flex-1">
                  <View
                    style={{ backgroundColor: preview.bg, height: "40%" }}
                  />
                  <View
                    style={{ backgroundColor: preview.surface, height: "30%" }}
                  />
                  <View
                    style={{ backgroundColor: preview.primary, height: "30%" }}
                  />
                </View>

                {/* Selected theme checkmark */}
                {isSelected && (
                  <View
                    className="absolute right-1 top-1 h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Check size={12} color={colors.primaryForeground} />
                  </View>
                )}
              </View>
              <Text
                className="mt-2 text-center text-xs"
                style={{
                  color: isSelected ? colors.text : colors.textSecondary,
                  fontWeight: isSelected ? "600" : "400",
                }}
              >
                {t(`theme_${theme.id}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Card>
  );
}
