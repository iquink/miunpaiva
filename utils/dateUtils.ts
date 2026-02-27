import { startOfDay, differenceInCalendarDays } from "date-fns";

/**
 * Date Utilities
 * Pure functions for date-related calculations
 */

/**
 * Check if a date is editable (today or yesterday only)
 * @param selectedDate - The date to check
 * @returns true if the date is today or yesterday
 */
export function isDateEditable(selectedDate: Date): boolean {
  const now = startOfDay(new Date());
  const selected = startOfDay(selectedDate);
  const diff = differenceInCalendarDays(now, selected);
  return diff === 0 || diff === 1; // 0 = today, 1 = yesterday
}

/**
 * Calculate difference in calendar days between two dates
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 * @returns Number of calendar days between dates
 */
export function getDaysDifference(dateLeft: Date, dateRight: Date): number {
  return differenceInCalendarDays(dateLeft, dateRight);
}
