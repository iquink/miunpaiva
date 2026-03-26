import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";

interface Props {
  label: string;
  active: boolean;
  onToggle: () => void;
}

export default function FilterToggle({ label, active, onToggle }: Props) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      onPress={onToggle}
      className="flex-row items-center py-1.5 px-3 rounded-[20px] border-[1.5px] mr-2"
      style={{
        borderColor: active ? colors.primary : colors.border,
        backgroundColor: active ? colors.primary + "18" : "transparent",
      }}
    >
      <View
        className="w-3.5 h-3.5 rounded-[3px] border-[1.5px] mr-1.5 justify-center items-center"
        style={{
          borderColor: active ? colors.primary : colors.border,
          backgroundColor: active ? colors.primary : "transparent",
        }}
      >
        {active && (
          <Text
            className="text-[9px] font-bold"
            style={{ color: colors.primaryForeground }}
          >
            ✓
          </Text>
        )}
      </View>
      <Text
        className="text-[13px] font-medium"
        style={{ color: active ? colors.primary : colors.textSecondary }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
