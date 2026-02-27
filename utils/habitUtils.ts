/**
 * Habit Utilities
 * Pure functions for habit-related business logic
 */

/**
 * Get streak color based on length
 * @param streak - The streak length in days
 * @returns Tailwind text color class
 */
export function getStreakColor(streak: number): string {
  if (streak >= 30) return "text-purple-600";
  if (streak >= 14) return "text-blue-600";
  if (streak >= 7) return "text-green-600";
  if (streak >= 3) return "text-yellow-600";
  return "text-gray-600";
}

/**
 * Calculate progress percentage for counter habits
 * @param currentValue - Current counter value
 * @param dailyGoal - Daily goal (null if no goal set)
 * @returns Progress percentage (0-100)
 */
export function calculateProgressPercentage(
  currentValue: number,
  dailyGoal: number | null,
): number {
  if (!dailyGoal) return 0;
  return Math.min((currentValue / dailyGoal) * 100, 100);
}

/**
 * Check if a counter habit goal is met
 * @param currentValue - Current counter value
 * @param dailyGoal - Daily goal (null if no goal set)
 * @returns true if goal is met or exceeded
 */
export function isGoalMet(
  currentValue: number,
  dailyGoal: number | null,
): boolean {
  return dailyGoal !== null && currentValue >= dailyGoal;
}
