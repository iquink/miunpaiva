import React from "react";
import { View, Text } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";

interface EmptyStateProps {
  /** Optional icon rendered above the title. */
  icon?: React.ReactNode;
  /** Primary message shown to the user. */
  title: string;
  /** Optional supporting text shown below the title. */
  description?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  const colors = useThemeColors();

  return (
    <View className="mt-12 items-center gap-3 px-6">
      {icon != null && <View className="mb-1">{icon}</View>}
      <Text
        className="text-base font-semibold text-center"
        style={{ color: colors.textSecondary }}
      >
        {title}
      </Text>
      {description != null && (
        <Text
          className="text-sm text-center"
          style={{ color: colors.textSecondary }}
        >
          {description}
        </Text>
      )}
    </View>
  );
}
