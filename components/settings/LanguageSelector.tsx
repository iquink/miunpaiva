import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Globe } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-6">
      <Text className="mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
        {t("language")}
      </Text>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => onLanguageChange("en")}
          className={`flex-1 flex-row items-center justify-center rounded-lg p-4 ${
            currentLanguage === "en"
              ? "bg-blue-500"
              : "bg-gray-100 dark:bg-slate-700"
          }`}
        >
          <Globe
            color={currentLanguage === "en" ? "white" : "#6b7280"}
            size={20}
          />
          <Text
            className={`ml-2 text-base font-semibold ${
              currentLanguage === "en"
                ? "text-white"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            English
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onLanguageChange("fi")}
          className={`flex-1 flex-row items-center justify-center rounded-lg p-4 ${
            currentLanguage === "fi"
              ? "bg-blue-500"
              : "bg-gray-100 dark:bg-slate-700"
          }`}
        >
          <Globe
            color={currentLanguage === "fi" ? "white" : "#6b7280"}
            size={20}
          />
          <Text
            className={`ml-2 text-base font-semibold ${
              currentLanguage === "fi"
                ? "text-white"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            Suomi
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
