import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Trash2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";
import { useThemeColors } from "../../hooks/useThemeColors";

interface DangerZoneSectionProps {
  onDeleteAccount: () => void;
  isDeleting: boolean;
}

export default function DangerZoneSection({
  onDeleteAccount,
  isDeleting,
}: DangerZoneSectionProps) {
  const { t } = useTranslation(["settings", "common"]);
  const colors = useThemeColors();

  return (
    <Card className="mb-6 border" style={{ borderColor: colors.error + "40" }}>
      <Text
        className="mb-3 text-sm font-semibold uppercase"
        style={{ color: colors.error }}
      >
        {t("danger_zone")}
      </Text>

      <TouchableOpacity
        onPress={onDeleteAccount}
        disabled={isDeleting}
        className="flex-row items-center rounded-lg p-4"
        style={{
          backgroundColor: colors.error + (isDeleting ? "30" : "20"),
        }}
      >
        <Trash2 color={colors.error} size={20} />
        <View className="ml-3 flex-1">
          <Text
            className="text-base font-semibold"
            style={{ color: colors.error }}
          >
            {isDeleting ? t("deleting") : t("delete_account")}
          </Text>
          <Text className="mt-1 text-xs" style={{ color: colors.error }}>
            {t("delete_account_description")}
          </Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
}
