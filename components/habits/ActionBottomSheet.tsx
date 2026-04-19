import React from "react";
import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import { X, Bell, BellOff, Trash2, Info } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import type { Habit } from "../../db/schema";
import { useThemeColors } from "../../hooks/useThemeColors";
import { getNotificationTimeLabel } from "../../services/notificationService";

const MODAL_DISMISS_DELAY_MS = 300;

interface ActionBottomSheetProps {
  visible: boolean;
  habit: Habit;
  onClose: () => void;
  onToggleNotification: () => void;
  onDelete: () => void;
  onDetails?: () => void;
}

export default function ActionBottomSheet({
  visible,
  habit,
  onClose,
  onToggleNotification,
  onDelete,
  onDetails,
}: ActionBottomSheetProps) {
  const colors = useThemeColors();
  const { t } = useTranslation(["tasks", "common"]);

  // Pre-compute before render — keeps JSX declarative
  const notifTimeLabel = getNotificationTimeLabel(habit.timeOfDay);

  const handleToggleNotification = () => {
    onClose();
    onToggleNotification();
  };

  const handleDeletePress = () => {
    onClose();
    setTimeout(() => {
      Alert.alert(t("delete"), t("delete_habit_message"), [
        { text: t("cancel"), style: "cancel" },
        { text: t("delete"), style: "destructive", onPress: onDelete },
      ]);
    }, MODAL_DISMISS_DELAY_MS);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* Backdrop — NativeWind bg-black/50 replaces hardcoded rgba literal */}
        <TouchableOpacity
          className="absolute inset-0 bg-black/50"
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Sheet */}
        <View
          className="rounded-t-[20px] p-6 pb-10"
          style={{ backgroundColor: colors.surface }}
        >
          {/* Header */}
          <View className="mb-5 flex-row items-center justify-between">
            <Text
              className="mr-3 flex-1 text-base font-bold"
              style={{ color: colors.text }}
              numberOfLines={1}
            >
              {habit.title}
            </Text>
            {/* Touch target padded to ≥44×44 pt for elderly/rehab users */}
            <TouchableOpacity className="p-3" onPress={onClose}>
              <X color={colors.textSecondary} size={20} />
            </TouchableOpacity>
          </View>

          {/* Toggle notifications */}
          <TouchableOpacity
            className="mb-3 flex-row items-center rounded-xl p-4"
            style={{ backgroundColor: colors.background }}
            onPress={handleToggleNotification}
          >
            <View className="mr-3.5">
              {habit.isNotificationsEnabled ? (
                <BellOff color={colors.primary} size={20} />
              ) : (
                <Bell color={colors.primary} size={20} />
              )}
            </View>
            <Text className="text-base" style={{ color: colors.text }}>
              {habit.isNotificationsEnabled
                ? t("notif_turn_off")
                : `${t("notif_turn_on")} (${notifTimeLabel})`}
            </Text>
          </TouchableOpacity>

          {/* Details */}
          {onDetails && (
            <TouchableOpacity
              className="mb-3 flex-row items-center rounded-xl p-4"
              style={{ backgroundColor: colors.background }}
              onPress={() => {
                onClose();
                onDetails();
              }}
            >
              <View className="mr-3.5">
                <Info color={colors.primary} size={20} />
              </View>
              <Text className="text-base" style={{ color: colors.text }}>
                {t("habit_details")}
              </Text>
            </TouchableOpacity>
          )}

          {/* Delete */}
          <TouchableOpacity
            className="flex-row items-center rounded-xl p-4"
            style={{ backgroundColor: colors.error + "18" }}
            onPress={handleDeletePress}
          >
            <View className="mr-3.5">
              <Trash2 color={colors.error} size={20} />
            </View>
            <Text
              className="text-base font-semibold"
              style={{ color: colors.error }}
            >
              {t("delete")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
