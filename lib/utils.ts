import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to display format
 */
export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Get streak color based on length
 */
export function getStreakColor(streak: number): string {
  if (streak >= 30) return "text-purple-600";
  if (streak >= 14) return "text-blue-600";
  if (streak >= 7) return "text-green-600";
  if (streak >= 3) return "text-yellow-600";
  return "text-gray-600";
}
