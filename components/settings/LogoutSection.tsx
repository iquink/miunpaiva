import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { LogOut } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";
import { useThemeColors } from "../../hooks/useThemeColors";

interface LogoutSectionProps {
  onLogout: () => void;
}

export default function LogoutSection({ onLogout }: LogoutSectionProps) {
  const { t } = useTranslation('common');
  const colors = useThemeColors();

  return (
    <Card className="mb-6">
      <Text
        className="mb-3 text-sm font-semibold uppercase"
        style={{ color: colors.textSecondary }}
      >
        {t("actions")}
      </Text>

      <TouchableOpacity
        onPress={onLogout}
        className="flex-row items-center rounded-lg p-4"
        style={{ backgroundColor: colors.background }}
      >
        <LogOut color={colors.textSecondary} size={20} />
        <Text
          className="ml-3 text-base font-semibold"
          style={{ color: colors.text }}
        >
          {t("logout")}
        </Text>
      </TouchableOpacity>
    </Card>
  );
}
