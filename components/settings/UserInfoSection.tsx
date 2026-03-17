import React from "react";
import { View, Text } from "react-native";
import { User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";
import { useThemeColors } from "../../hooks/useThemeColors"; // 1. Импортируем наш новый хук

interface UserInfoSectionProps {
  username: string;
  userId: number;
  createdAt?: Date | string;
}

export default function UserInfoSection({
  username,
  userId,
  createdAt,
}: UserInfoSectionProps) {
  const { t } = useTranslation();
  const colors = useThemeColors(); // 2. Получаем текущую палитру

  return (
    <Card
      className="mb-6"
      // Если Card внутри себя не использует цвета темы, зададим их здесь для надежности
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <Text
        className="mb-3 text-sm font-semibold uppercase"
        style={{ color: colors.textSecondary }} // Заменили text-gray-500
      >
        {t("account_info")}
      </Text>

      <View className="flex-row items-center">
        <View
          className="mr-3 h-12 w-12 items-center justify-center rounded-full"
          // "33" в конце hex-кода дает ~20% непрозрачности.
          // Это создаст красивый светлый фон цвета Primary для иконки.
          style={{ backgroundColor: colors.primary + "33" }}
        >
          <User color={colors.primary} size={24} />
        </View>
        <View>
          <Text
            className="text-base font-semibold"
            style={{ color: colors.text }} // Заменили text-gray-900
          >
            {username}
          </Text>
          <Text
            className="text-sm"
            style={{ color: colors.textSecondary }} // Заменили text-gray-500
          >
            {t("user_id")}: {userId}
          </Text>
        </View>
      </View>

      {createdAt && (
        <View
          className="mt-3 rounded-lg p-3"
          style={{ backgroundColor: colors.background }} // Заменили bg-gray-50
        >
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {t("member_since")}: {new Date(createdAt).toLocaleDateString()}
          </Text>
        </View>
      )}
    </Card>
  );
}
