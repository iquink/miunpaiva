import { useMemo, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { startOfToday } from "date-fns";
import { useHabits } from "./useHabits";

export function useHubStats(userId: number | undefined) {
  const today = useMemo(() => startOfToday(), []);
  const { userHabits, habitLogs, onRefresh } = useHabits(userId, today);

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [onRefresh]),
  );

  const todayTotal = userHabits.length;
  const todayCompleted = useMemo(() => {
    return userHabits.filter((h) => habitLogs.get(h.id)?.completed).length;
  }, [userHabits, habitLogs]);

  const progressPercent =
    todayTotal === 0 ? 0 : Math.round((todayCompleted / todayTotal) * 100);

  return { todayTotal, todayCompleted, progressPercent };
}
