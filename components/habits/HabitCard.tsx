import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
} from "react-native";
import {
  Check,
  X,
  TrendingUp,
  Lock,
  Bell,
  BellOff,
  Trash2,
} from "lucide-react-native";
import type { Habit, Log } from "../../db/schema";
import HabitValueModal from "./HabitValueModal";
import { isDateEditable } from "../../utils/dateUtils";
import { useThemeColors } from "../../hooks/useThemeColors";
import { getNotificationTimeLabel } from "../../services/notificationService";
import { useTranslation } from "react-i18next";
import React from "react";

interface HabitCardProps {
  habit: Habit;
  log?: Log;
  selectedDate: Date;
  onToggle: (habit: Habit) => void;
  onUpdateValue: (habit: Habit, value: number) => void;
  onToggleNotification: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

export default function HabitCard({
  habit,
  log,
  selectedDate,
  onToggle,
  onUpdateValue,
  onToggleNotification,
  onDelete,
}: HabitCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const colors = useThemeColors();
  const { t } = useTranslation("common");

  const isBoolean = habit.type === "boolean";
  const isCounter = habit.type === "counter";
  const currentValue = log?.value || 0;
  const isCompleted = log?.completed || false;

  // Calculate if date is editable (Today or Yesterday only)
  const isEditable = isDateEditable(selectedDate);

  const handlePress = () => {
    if (!isEditable) return; // Locked - no action

    if (isBoolean) {
      onToggle(habit);
    } else if (isCounter) {
      setShowModal(true);
    }
  };

  const handleSaveValue = (value: number) => {
    onUpdateValue(habit, value);
  };

  const handleToggleNotification = () => {
    setShowActionModal(false);
    onToggleNotification(habit);
  };

  const handleDeletePress = () => {
    setShowActionModal(false);
    // Wait for the bottom-sheet animation to finish before showing Alert
    setTimeout(() => {
      Alert.alert(t("delete"), t("delete_habit_message"), [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: () => onDelete(habit),
        },
      ]);
    }, 300);
  };

  // Calculate progress for counter habits
  const getProgressPercentage = () => {
    if (!isCounter || !habit.dailyGoal) return 0;
    return Math.min((currentValue / habit.dailyGoal) * 100, 100);
  };

  const progressPercentage = getProgressPercentage();
  const isGoalMet =
    isCounter && habit.dailyGoal && currentValue >= habit.dailyGoal;

  // Determine card background color
  const getCardBgColor = () => {
    if (isBoolean && isCompleted) return colors.success + "20";
    if (isCounter && isGoalMet) return colors.success + "20";
    return colors.surface;
  };

  // Determine text color for title
  const getTitleColor = () => {
    if (isBoolean && isCompleted) return colors.success;
    if (isCounter && isGoalMet) return colors.success;
    return colors.text;
  };

  // Determine icon background color
  const getIconBgColor = () => {
    if (!isEditable) return colors.border;
    if (isBoolean) {
      return isCompleted ? colors.success : colors.border;
    }
    return isGoalMet ? colors.success : colors.primary;
  };

  // Determine icon color
  const getIconColor = () => {
    if (!isEditable) return colors.textSecondary;
    if (isBoolean && !isCompleted) return colors.textSecondary;
    return colors.primaryForeground;
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={() => setShowActionModal(true)}
        delayLongPress={400}
        className="mb-3 rounded-xl p-4"
        style={{
          backgroundColor: getCardBgColor(),
          opacity: isEditable ? 1 : 0.5,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text
              className="text-base font-semibold"
              style={{ color: getTitleColor() }}
            >
              {habit.title}
            </Text>

            {habit.description && (
              <Text
                className="mt-1 text-xs"
                style={{ color: colors.textSecondary }}
              >
                {habit.description}
              </Text>
            )}

            {/* Counter Progress Display */}
            {isCounter && (
              <View className="mt-2">
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  {currentValue}
                  {habit.dailyGoal && ` / ${habit.dailyGoal}`}
                  {habit.unit && ` ${habit.unit}`}
                </Text>

                {habit.dailyGoal && (
                  <View
                    className="mt-2 h-2 overflow-hidden rounded-full"
                    style={{ backgroundColor: colors.border + "40" }}
                  >
                    <View
                      className="h-full"
                      style={{
                        width: `${progressPercentage}%`,
                        backgroundColor: isGoalMet
                          ? colors.success
                          : colors.primary,
                      }}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Type Label */}
            <Text
              className="mt-2 text-xs"
              style={{ color: colors.textSecondary }}
            >
              {isBoolean ? "Yes/No" : "Counter"}
            </Text>
          </View>

          {/* Icon */}
          <View
            className="h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: getIconBgColor() }}
          >
            {!isEditable ? (
              <Lock color={getIconColor()} size={20} />
            ) : isBoolean ? (
              isCompleted ? (
                <Check color={getIconColor()} size={24} />
              ) : (
                <X color={getIconColor()} size={24} />
              )
            ) : (
              <TrendingUp color={getIconColor()} size={24} />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Counter Value Modal */}
      {isCounter && (
        <HabitValueModal
          visible={showModal}
          habit={habit}
          currentValue={currentValue}
          onClose={() => setShowModal(false)}
          onSave={handleSaveValue}
        />
      )}

      {/* Action Modal (bottom sheet) */}
      <Modal
        visible={showActionModal}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setShowActionModal(false)}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          {/* Backdrop */}
          <TouchableOpacity
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0,0,0,0.45)",
            }}
            activeOpacity={1}
            onPress={() => setShowActionModal(false)}
          />

          {/* Sheet */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 24,
              paddingBottom: 40,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: "700",
                  flex: 1,
                  marginRight: 12,
                }}
                numberOfLines={1}
              >
                {habit.title}
              </Text>
              <TouchableOpacity onPress={() => setShowActionModal(false)}>
                <X color={colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>

            {/* Toggle notifications */}
            <TouchableOpacity
              onPress={handleToggleNotification}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                borderRadius: 12,
                backgroundColor: colors.background,
                marginBottom: 12,
              }}
            >
              <View style={{ marginRight: 14 }}>
                {habit.isNotificationsEnabled ? (
                  <BellOff color={colors.primary} size={20} />
                ) : (
                  <Bell color={colors.primary} size={20} />
                )}
              </View>
              <Text style={{ color: colors.text, fontSize: 15 }}>
                {habit.isNotificationsEnabled
                  ? t("notif_turn_off")
                  : `${t("notif_turn_on")} (${getNotificationTimeLabel(habit.timeOfDay)})`}
              </Text>
            </TouchableOpacity>

            {/* Delete */}
            <TouchableOpacity
              onPress={handleDeletePress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                borderRadius: 12,
                backgroundColor: colors.error + "18",
              }}
            >
              <View style={{ marginRight: 14 }}>
                <Trash2 color={colors.error} size={20} />
              </View>
              <Text
                style={{ color: colors.error, fontSize: 15, fontWeight: "600" }}
              >
                {t("delete")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
