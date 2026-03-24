import { Tabs } from "expo-router";
import { Home, Award, Settings, Wind } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import React from "react";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function TabsLayout() {
  const { t } = useTranslation('common');
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("dashboard"),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: t("achievements"),
          tabBarIcon: ({ color, size }) => <Award color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings"),
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="relax"
        options={{
          title: t("relax"),
          tabBarIcon: ({ color, size }) => <Wind color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
