import React from "react";
import { View, Text } from "react-native";
import { User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";

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

  return (
    <Card className="mb-6">
      <Text className="mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
        {t("account_info")}
      </Text>

      <View className="flex-row items-center">
        <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <User color="#3b82f6" size={24} />
        </View>
        <View>
          <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {username}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {t("user_id")}: {userId}
          </Text>
        </View>
      </View>

      {createdAt && (
        <View className="mt-3 rounded-lg bg-gray-50 dark:bg-slate-700 p-3">
          <Text className="text-xs text-gray-600 dark:text-gray-400">
            {t("member_since")}: {new Date(createdAt).toLocaleDateString()}
          </Text>
        </View>
      )}
    </Card>
  );
}
