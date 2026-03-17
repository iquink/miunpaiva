import React from "react";
import { TextInput, Text, View, type TextInputProps } from "react-native";
import { cn } from "../../lib/utils";
import { useThemeColors } from "../../hooks/useThemeColors";

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
  const colors = useThemeColors();

  return (
    <View className={cn("", containerClassName)}>
      {label && (
        <Text
          className="mb-2 text-sm font-medium"
          style={{ color: colors.text }}
        >
          {label}
        </Text>
      )}
      <TextInput
        className={cn("rounded-lg border px-4 py-3", className)}
        style={{
          borderColor: error ? colors.error : colors.border,
          backgroundColor: colors.surface,
          color: colors.text,
        }}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && (
        <Text className="mt-1 text-sm" style={{ color: colors.error }}>
          {error}
        </Text>
      )}
    </View>
  );
}
