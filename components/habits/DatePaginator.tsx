import React from "react";
import { View, Text } from "react-native";
import { format, startOfToday } from "date-fns";
import { fi } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import IconButton from "../ui/IconButton";

interface DatePaginatorProps {
  selectedDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export default function DatePaginator({
  selectedDate,
  onPrevDay,
  onNextDay,
}: DatePaginatorProps) {
  const { t } = useTranslation();
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const todayStr = format(startOfToday(), "yyyy-MM-dd");

  return (
    <View className="flex-row items-center justify-between bg-white dark:bg-slate-800 px-6 py-4">
      <IconButton
        variant="ghost"
        size="md"
        icon={<ChevronLeft color="#6b7280" size={24} />}
        onPress={onPrevDay}
      />

      <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {dateStr === todayStr
          ? t("today")
          : format(selectedDate, "eeeeee dd.MM.yyyy", { locale: fi })}
      </Text>

      <IconButton
        variant="ghost"
        size="md"
        icon={<ChevronRight color="#6b7280" size={24} />}
        onPress={onNextDay}
      />
    </View>
  );
}
