import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { LogOut } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";

interface LogoutSectionProps {
  onLogout: () => void;
}

export default function LogoutSection({ onLogout }: LogoutSectionProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-6">
      <Text className="mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
        {t("actions")}
      </Text>

      <TouchableOpacity
        onPress={onLogout}
        className="flex-row items-center rounded-lg bg-gray-100 dark:bg-slate-700 p-4"
      >
        <LogOut color="#6b7280" size={20} />
        <Text className="ml-3 text-base font-semibold text-gray-700 dark:text-gray-300">
          {t("logout")}
        </Text>
      </TouchableOpacity>
    </Card>
  );
}
