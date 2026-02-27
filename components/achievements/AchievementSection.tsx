import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

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

  return (
    <>
      <Text className="mb-3 mt-6 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
        {title}
      </Text>
      {!showSection ? (
        <Text className="mb-4 text-gray-400 dark:text-gray-500">
          {emptyMessage}
        </Text>
      ) : (
        children
      )}
    </>
  );
}
