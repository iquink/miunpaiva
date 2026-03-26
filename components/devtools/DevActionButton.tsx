import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";

interface DevActionButtonProps {
  label: string;
  description: string;
  onPress: () => void;
  destructive?: boolean;
}

export default function DevActionButton({
  label,
  description,
  onPress,
  destructive = false,
}: DevActionButtonProps) {
  const colors = useThemeColors();
  return (
    <TouchableOpacity
      className="mb-3 rounded-xl p-4"
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: destructive ? (colors.error ?? "#ef4444") : colors.border,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        className="text-base font-semibold"
        style={{
          color: destructive ? (colors.error ?? "#ef4444") : colors.text,
        }}
      >
        {label}
      </Text>
      <Text className="mt-0.5 text-xs" style={{ color: colors.textSecondary }}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}
