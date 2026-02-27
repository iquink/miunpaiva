import React from "react";
import { TextInput, Text, View, type TextInputProps } from "react-native";
import { cn } from "../../lib/utils";

interface InputProps extends Omit<TextInputProps, "className"> {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
}

export default function Input({
  label,
  error,
  className,
  containerClassName,
  ...props
}: InputProps) {
  return (
    <View className={cn("", containerClassName)}>
      {label && (
        <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </Text>
      )}
      <TextInput
        className={cn(
          "rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-gray-900 dark:text-gray-100",
          error && "border-red-500",
          className,
        )}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
}
