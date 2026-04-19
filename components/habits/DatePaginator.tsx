import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { format, startOfToday } from "date-fns";
import { fi } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import IconButton from "../ui/IconButton";
import { useThemeColors } from "../../hooks/useThemeColors";

interface DatePaginatorProps {
  selectedDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  onDatePress?: () => void;
}

export default function DatePaginator({
  selectedDate,
  onPrevDay,
  onNextDay,
  onDatePress,
}: DatePaginatorProps) {
  const { t } = useTranslation(["tasks", "hub", "common"]);
  const colors = useThemeColors();
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const todayStr = format(startOfToday(), "yyyy-MM-dd");

  return (
    <View
      className="flex-row items-center justify-between px-6 py-4"
      style={{ backgroundColor: colors.surface }}
    >
      <IconButton
        variant="ghost"
        size="md"
        icon={<ChevronLeft color={colors.textSecondary} size={24} />}
        onPress={onPrevDay}
      />

      <TouchableOpacity
        className="flex-row items-center gap-2"
        onPress={onDatePress}
        accessibilityRole="button"
        accessibilityLabel={t("select_date")}
        disabled={!onDatePress}
      >
        <CalendarDays size={18} color={colors.primary} />
        <Text
          className="text-lg font-semibold"
          style={{ color: colors.primary }}
        >
          {dateStr === todayStr
            ? t("today")
            : format(selectedDate, "eeeeee dd.MM.yyyy", { locale: fi })}
        </Text>
      </TouchableOpacity>

      <IconButton
        variant="ghost"
        size="md"
        icon={<ChevronRight color={colors.textSecondary} size={24} />}
        onPress={onNextDay}
      />
    </View>
  );
}
