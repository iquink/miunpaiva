import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Sun, Moon } from "lucide-react-native";
import Card from "../ui/Card";

interface ThemeSelectorProps {
  currentTheme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

export default function ThemeSelector({
  currentTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  return (
    <Card className="mb-6">
      <Text className="mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
        Theme
      </Text>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => onThemeChange("light")}
          className={`flex-1 flex-row items-center justify-center rounded-lg p-3 ${
            currentTheme === "light"
              ? "bg-yellow-500"
              : "bg-gray-100 dark:bg-slate-700"
          }`}
        >
          <Sun
            color={currentTheme === "light" ? "white" : "#6b7280"}
            size={20}
          />
          <Text
            className={`ml-2 text-sm font-semibold ${
              currentTheme === "light"
                ? "text-white"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            Light
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onThemeChange("dark")}
          className={`flex-1 flex-row items-center justify-center rounded-lg p-3 ${
            currentTheme === "dark"
              ? "bg-slate-700"
              : "bg-gray-100 dark:bg-slate-700"
          }`}
        >
          <Moon
            color={currentTheme === "dark" ? "white" : "#6b7280"}
            size={20}
          />
          <Text
            className={`ml-2 text-sm font-semibold ${
              currentTheme === "dark"
                ? "text-white"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            Dark
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
