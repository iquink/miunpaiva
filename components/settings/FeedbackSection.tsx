import React from "react";
import { View, Text, Switch } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";

interface Props {
  isToastsEnabled: boolean;
  isSoundEnabled: boolean;
  onToggleToasts: () => void;
  onToggleSound: () => void;
}

export default function FeedbackSection({
  isToastsEnabled,
  isSoundEnabled,
  onToggleToasts,
  onToggleSound,
}: Props) {
  const { t } = useTranslation(["settings", "common"]);
  const colors = useThemeColors();

  return (
    <View className="mb-6">
      <Text
        className="mb-3 text-xs font-semibold uppercase tracking-widest"
        style={{ color: colors.textSecondary }}
      >
        {t("settings_feedback_section")}
      </Text>
      <View
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {/* Pop-up notifications */}
        <View
          className="flex-row items-center justify-between px-4 py-4"
          style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text
              className="text-sm font-semibold"
              style={{ color: colors.text }}
            >
              {t("settings_toasts_title")}
            </Text>
            <Text
              className="mt-0.5 text-xs"
              style={{ color: colors.textSecondary }}
            >
              {t("settings_toasts_desc")}
            </Text>
          </View>
          <Switch
            value={isToastsEnabled}
            onValueChange={onToggleToasts}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>
        {/* Sound effects */}
        <View className="flex-row items-center justify-between px-4 py-4">
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text
              className="text-sm font-semibold"
              style={{
                color: isToastsEnabled ? colors.text : colors.textSecondary,
              }}
            >
              {t("settings_sound_title")}
            </Text>
          </View>
          <Switch
            value={isSoundEnabled}
            onValueChange={onToggleSound}
            disabled={!isToastsEnabled}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>
      </View>
    </View>
  );
}
