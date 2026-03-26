import React from "react";
import { Text } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";

interface TimeSectionHeaderProps {
  title: string;
}

export default function TimeSectionHeader({ title }: TimeSectionHeaderProps) {
  const colors = useThemeColors();

  return (
    <Text
      className="text-xl font-bold mt-6 mb-3 px-2"
      style={{ color: colors.text }}
    >
      {title}
    </Text>
  );
}
