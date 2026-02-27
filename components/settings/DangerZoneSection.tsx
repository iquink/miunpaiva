import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Trash2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";

interface DangerZoneSectionProps {
  onDeleteAccount: () => void;
  isDeleting: boolean;
}

export default function DangerZoneSection({
  onDeleteAccount,
  isDeleting,
}: DangerZoneSectionProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-6 border border-red-200 dark:border-red-900">
      <Text className="mb-3 text-sm font-semibold uppercase text-red-600 dark:text-red-400">
        {t("danger_zone")}
      </Text>

      <TouchableOpacity
        onPress={onDeleteAccount}
        disabled={isDeleting}
        className={`flex-row items-center rounded-lg p-4 ${
          isDeleting
            ? "bg-red-200 dark:bg-red-900"
            : "bg-red-100 dark:bg-red-900/50"
        }`}
      >
        <Trash2 color="#dc2626" size={20} />
        <View className="ml-3 flex-1">
          <Text className="text-base font-semibold text-red-600 dark:text-red-400">
            {isDeleting ? t("deleting") : t("delete_account")}
          </Text>
          <Text className="mt-1 text-xs text-red-500 dark:text-red-400">
            {t("delete_account_description")}
          </Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
}
