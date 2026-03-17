import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";

interface AchievementSectionProps {
  title: string;
  emptyMessage: string;
  children: React.ReactNode;
  showSection: boolean;
}

export default function AchievementSection({
  title,
  emptyMessage,
  children,
  showSection,
}: AchievementSectionProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <>
      <Text
        className="mb-3 mt-6 text-sm font-semibold uppercase"
        style={{ color: colors.textSecondary }}
      >
        {title}
      </Text>
      {!showSection ? (
        <Text className="mb-4" style={{ color: colors.textSecondary }}>
          {emptyMessage}
        </Text>
      ) : (
        children
      )}
    </>
  );
}
