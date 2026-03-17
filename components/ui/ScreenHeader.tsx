import React from "react";
import { View, Text, type ViewProps } from "react-native";
import { cn } from "../../lib/utils";
import { useThemeColors } from "../../hooks/useThemeColors";

interface ScreenHeaderProps extends Omit<ViewProps, "className"> {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function ScreenHeader({
  title,
  subtitle,
  className,
  ...props
}: ScreenHeaderProps) {
  const colors = useThemeColors();

  return (
    <View
      className={cn("px-6 pb-4 pt-12", className)}
      style={{ backgroundColor: colors.surface }}
      {...props}
    >
      <Text className="text-2xl font-bold" style={{ color: colors.text }}>
        {title}
      </Text>
      {subtitle && (
        <Text className="mt-1" style={{ color: colors.textSecondary }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
