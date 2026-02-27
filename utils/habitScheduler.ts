import { endOfDay, startOfDay } from "date-fns";
import type { Habit } from "../db/schema";

/**
 * Habit Scheduler Utility
 * Contains pure functions for determining habit visibility based on schedule
 */

/**
 * Determine if a habit should be shown on a specific date based on its schedule
 * @param habit - The habit to check
 * @param selectedDate - The date to check against
 * @returns true if the habit should be shown on the selected date
 */
export function shouldShowHabit(habit: Habit, selectedDate: Date): boolean {
  const selectedDateEnd = endOfDay(selectedDate);

  // 1. Habit must have been created before or on selected date
  if (habit.createdAt && new Date(habit.createdAt) > selectedDateEnd) {
    return false;
  }

  // 2. Check end date (for daily/weekly)
  if (habit.endDate && new Date(habit.endDate) < selectedDateEnd) {
    return false;
  }

  // 3. Check frequency-specific rules
  if (habit.frequency === "once") {
    // One-time: only show on exact target date
    if (!habit.targetDate) return false;
    const selectedDateStart = startOfDay(selectedDate);
    const targetDateStart = startOfDay(new Date(habit.targetDate));
    return targetDateStart.getTime() === selectedDateStart.getTime();
  } else if (habit.frequency === "weekly") {
    // Weekly: check if selected date's weekday is in frequencyDays
    if (!habit.frequencyDays) return false;
    try {
      const days: number[] = JSON.parse(habit.frequencyDays);
      const selectedDayOfWeek = selectedDate.getDay();
      return days.includes(selectedDayOfWeek);
    } catch {
      return false;
    }
  } else {
    // Daily: always show (already checked end_date above)
    return true;
  }
}
