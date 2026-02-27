import React from "react";
import { View, Text, type ViewProps } from "react-native";
import { cn } from "../../lib/utils";

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
  return (
    <View
      className={cn("bg-white dark:bg-slate-800 px-6 pb-4 pt-12", className)}
      {...props}
    >
      <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </Text>
      {subtitle && (
        <Text className="mt-1 text-gray-600 dark:text-gray-400">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
