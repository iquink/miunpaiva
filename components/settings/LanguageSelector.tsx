import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Globe } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";
import { useThemeColors } from "../../hooks/useThemeColors";

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <Card className="mb-6">
      <Text
        className="mb-3 text-sm font-semibold uppercase"
        style={{ color: colors.textSecondary }}
      >
        {t("language")}
      </Text>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => onLanguageChange("en")}
          className="flex-1 flex-row items-center justify-center rounded-lg p-4"
          style={{
            backgroundColor:
              currentLanguage === "en" ? colors.primary : colors.background,
          }}
        >
          <Globe
            color={
              currentLanguage === "en"
                ? colors.primaryForeground
                : colors.textSecondary
            }
            size={20}
          />
          <Text
            className="ml-2 text-base font-semibold"
            style={{
              color:
                currentLanguage === "en"
                  ? colors.primaryForeground
                  : colors.text,
            }}
          >
            English
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onLanguageChange("fi")}
          className="flex-1 flex-row items-center justify-center rounded-lg p-4"
          style={{
            backgroundColor:
              currentLanguage === "fi" ? colors.primary : colors.background,
          }}
        >
          <Globe
            color={
              currentLanguage === "fi"
                ? colors.primaryForeground
                : colors.textSecondary
            }
            size={20}
          />
          <Text
            className="ml-2 text-base font-semibold"
            style={{
              color:
                currentLanguage === "fi"
                  ? colors.primaryForeground
                  : colors.text,
            }}
          >
            Suomi
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
