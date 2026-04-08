import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useDashboard } from "../../hooks/useDashboard";
import type { Habit } from "../../db/schema";
import HabitCard from "../../components/habits/HabitCard";
import HabitDetailsModal from "../../components/habits/HabitDetailsModal";
import ScreenHeader from "../../components/ui/ScreenHeader";
import IconButton from "../../components/ui/IconButton";
import DatePaginator from "../../components/habits/DatePaginator";
import CreateHabitForm from "../../components/habits/CreateHabitForm";
import EmptyState from "../../components/ui/EmptyState";
import TimeSectionHeader from "../../components/habits/TimeSectionHeader";

export default function DashboardScreen() {
  const { t } = useTranslation("common");
  const colors = useThemeColors();
  const user = useAuthStore((state) => state.user);
  const dashboard = useDashboard(user?.id);
  const { openModalId } = useLocalSearchParams<{ openModalId?: string }>();

  const [modalHabitId, setModalHabitId] = useState<number | null>(null);

  // Deep-link: open details modal when openModalId query param is present.
  useEffect(() => {
    if (!openModalId) return;
    const id = Number(openModalId);
    if (!isNaN(id)) {
      setModalHabitId(id);
    }
  }, [openModalId]);

  const modalHabit =
    modalHabitId !== null
      ? (dashboard.sections
          .flatMap((s) => s.habits)
          .find((h) => h.id === modalHabitId) ?? null)
      : null;

  const handleModalUpdateLog = useCallback(
    (habit: Habit, value?: number) => {
      if (value !== undefined) {
        dashboard.updateCounterValue(habit, value);
      } else {
        dashboard.toggleBooleanHabit(habit);
      }
    },
    [dashboard],
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title={t("dashboard")} subtitle={t("dashboard_subtitle")} />

      <DatePaginator
        selectedDate={dashboard.selectedDate}
        onPrevDay={dashboard.goToPrevDay}
        onNextDay={dashboard.goToNextDay}
        onDatePress={dashboard.openDatePicker}
      />

      {dashboard.showPicker && (
        <DateTimePicker
          value={dashboard.selectedDate}
          mode="date"
          display="default"
          onChange={dashboard.onDateChange}
        />
      )}

      <ScrollView
        className="flex-1 px-6 py-4"
        refreshControl={
          <RefreshControl
            refreshing={dashboard.refreshing}
            onRefresh={dashboard.onRefresh}
          />
        }
      >
        {dashboard.isEmpty ? (
          <EmptyState title={t("no_habits")} />
        ) : (
          dashboard.sections.map(({ key, titleKey, habits }) => (
            <View key={key}>
              <TimeSectionHeader title={t(titleKey)} />
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  log={dashboard.getLogFor(habit.id)}
                  selectedDate={dashboard.selectedDate}
                  onToggle={dashboard.toggleBooleanHabit}
                  onUpdateValue={dashboard.updateCounterValue}
                  onToggleNotification={dashboard.toggleHabitNotification}
                  onDelete={dashboard.deleteHabit}
                  onDetails={(h) => setModalHabitId(h.id)}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {!dashboard.showAddHabit && (
        <IconButton
          icon={<Plus color="white" size={28} />}
          onPress={dashboard.openAddHabit}
          className="absolute bottom-6 right-6"
        />
      )}

      {dashboard.showAddHabit && (
        <CreateHabitForm
          categories={dashboard.categories}
          presets={dashboard.presets}
          onSubmit={dashboard.handleAddHabit}
          onCancel={dashboard.closeAddHabit}
        />
      )}

      <HabitDetailsModal
        visible={modalHabitId !== null}
        habit={modalHabit}
        log={modalHabit ? dashboard.getLogFor(modalHabit.id) : undefined}
        onClose={() => setModalHabitId(null)}
        onUpdateLog={handleModalUpdateLog}
      />
    </View>
  );
}
