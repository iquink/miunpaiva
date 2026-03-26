import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";

interface GeneratorCardProps {
  title: string;
  description: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onGenerate: () => void;
}

export default function GeneratorCard({
  title,
  description,
  inputValue,
  onInputChange,
  onGenerate,
}: GeneratorCardProps) {
  const colors = useThemeColors();
  return (
    <View
      className="mb-3 rounded-xl p-4"
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text
        className="mb-2 text-base font-semibold"
        style={{ color: colors.text }}
      >
        {title}
      </Text>
      <Text className="mb-3 text-xs" style={{ color: colors.textSecondary }}>
        {description}
      </Text>
      <View className="flex-row items-center gap-2">
        <TextInput
          value={inputValue}
          onChangeText={onInputChange}
          keyboardType="number-pad"
          maxLength={5}
          className="mr-2 flex-1 rounded-lg px-3 py-2 text-base"
          style={{
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
            color: colors.text,
          }}
          selectTextOnFocus
        />
        <TouchableOpacity
          className="rounded-lg px-4 py-2"
          style={{ backgroundColor: colors.primary ?? "#6366f1" }}
          onPress={onGenerate}
          activeOpacity={0.7}
        >
          <Text className="text-sm font-semibold" style={{ color: "#ffffff" }}>
            Generate
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
