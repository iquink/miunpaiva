import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Sun, Moon } from "lucide-react-native";
import Card from "../ui/Card";
import { useThemeColors } from "../../hooks/useThemeColors";

interface ThemeSelectorProps {
  currentTheme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

export default function ThemeSelector({
  currentTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  const colors = useThemeColors();

  return (
    <Card className="mb-6">
      <Text
        className="mb-3 text-sm font-semibold uppercase"
        style={{ color: colors.textSecondary }}
      >
        Theme
      </Text>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => onThemeChange("light")}
          className="flex-1 flex-row items-center justify-center rounded-lg p-3"
          style={{
            backgroundColor:
              currentTheme === "light" ? colors.warning : colors.background,
          }}
        >
          <Sun
            color={
              currentTheme === "light"
                ? colors.primaryForeground
                : colors.textSecondary
            }
            size={20}
          />
          <Text
            className="ml-2 text-sm font-semibold"
            style={{
              color:
                currentTheme === "light"
                  ? colors.primaryForeground
                  : colors.text,
            }}
          >
            Light
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onThemeChange("dark")}
          className="flex-1 flex-row items-center justify-center rounded-lg p-3"
          style={{
            backgroundColor:
              currentTheme === "dark" ? colors.text : colors.background,
          }}
        >
          <Moon
            color={
              currentTheme === "dark" ? colors.surface : colors.textSecondary
            }
            size={20}
          />
          <Text
            className="ml-2 text-sm font-semibold"
            style={{
              color: currentTheme === "dark" ? colors.surface : colors.text,
            }}
          >
            Dark
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
