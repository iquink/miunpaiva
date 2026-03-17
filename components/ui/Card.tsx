import React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "../../lib/utils";
import { useThemeColors } from "../../hooks/useThemeColors";

interface CardProps extends Omit<ViewProps, "className"> {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className, ...props }: CardProps) {
  const colors = useThemeColors();

  return (
    <View
      className={cn("rounded-xl p-4", className)}
      style={{ backgroundColor: colors.surface }}
      {...props}
    >
      {children}
    </View>
  );
}
