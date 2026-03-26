import * as Notifications from "expo-notifications";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { habits } from "../db/schema";
import type { Habit } from "../db/schema";

// Show notifications even when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** Maps timeOfDay values to wall-clock hours */
const TIME_MAP: Record<string, { hour: number; minute: number }> = {
  morning: { hour: 9, minute: 0 },
  late_morning: { hour: 11, minute: 0 },
  afternoon: { hour: 15, minute: 0 },
  evening: { hour: 19, minute: 0 },
  all_day: { hour: 10, minute: 0 },
};

/** Returns "HH:MM" label for the given timeOfDay key */
export function getNotificationTimeLabel(timeOfDay: string): string {
  const { hour, minute } = TIME_MAP[timeOfDay] ?? TIME_MAP.all_day;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/**
 * Request notification permissions from the OS.
 * Returns true if granted.
 */
export async function requestPermissionsAsync(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

/**
 * Schedule one or more notifications for a habit.
 *
 * - daily   → one repeating daily notification
 * - weekly  → one repeating weekly notification per selected weekday
 * - once    → single notification fired at targetDate (only if in the future)
 *
 * Returns a single notification ID string, or a JSON-stringified array of IDs
 * for weekly habits.  Returns null if nothing could be scheduled.
 */
export async function scheduleHabitNotification(
  habit: Habit,
): Promise<string | null> {
  const { hour, minute } = TIME_MAP[habit.timeOfDay] ?? TIME_MAP.all_day;

  const content: Notifications.NotificationContentInput = {
    title: habit.title,
    body: habit.description ?? "Time to complete your habit!",
  };

  try {
    // ── Daily ──────────────────────────────────────────────────────────────
    if (habit.frequency === "daily") {
      const id = await Notifications.scheduleNotificationAsync({
        content,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
      return id;
    }

    // ── Weekly ─────────────────────────────────────────────────────────────
    if (habit.frequency === "weekly") {
      const days: number[] = habit.frequencyDays
        ? (JSON.parse(habit.frequencyDays) as number[])
        : [];

      const ids: string[] = [];
      for (const day of days) {
        // Our app stores 0 = Sunday … 6 = Saturday.
        // expo-notifications uses 1 = Sunday … 7 = Saturday.
        const id = await Notifications.scheduleNotificationAsync({
          content,
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: day + 1,
            hour,
            minute,
          },
        });
        ids.push(id);
      }
      return ids.length > 0 ? JSON.stringify(ids) : null;
    }

    // ── One-time ───────────────────────────────────────────────────────────
    if (habit.frequency === "once" && habit.targetDate) {
      // targetDate is stored as a JS Date (mode: "timestamp")
      const fireDate = new Date(habit.targetDate as unknown as Date);
      fireDate.setHours(hour, minute, 0, 0);

      if (fireDate > new Date()) {
        const id = await Notifications.scheduleNotificationAsync({
          content,
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: fireDate,
          },
        });
        return id;
      }
    }
  } catch (err) {
    console.error("[NotificationService] schedule error:", err);
  }

  return null;
}

/**
 * Cancel scheduled notification(s) for a habit.
 * `notificationId` may be a single ID or a JSON-stringified array (weekly).
 */
export async function cancelHabitNotification(
  notificationId: string,
): Promise<void> {
  try {
    if (notificationId.startsWith("[")) {
      const ids = JSON.parse(notificationId) as string[];
      await Promise.all(
        ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)),
      );
    } else {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
  } catch (err) {
    console.error("[NotificationService] cancel error:", err);
  }
}

/**
 * Cancel ALL scheduled notifications on this device.
 * Call on logout so a subsequent user never sees another user's reminders.
 */
export async function clearAllDeviceNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (err) {
    console.error("[NotificationService] clearAll error:", err);
  }
}

/**
 * Re-sync OS notifications for every notification-enabled habit of userId.
 *
 * Algorithm:
 *   1. Wipe all existing OS triggers (clean slate – prevents cross-user leaks).
 *   2. Query the habits owned by userId that have isNotificationsEnabled = true.
 *   3. Re-schedule each one and persist the new OS notification ID back to DB.
 *
 * Call after successful login and after session restore on app start.
 */
export async function syncUserNotifications(userId: number): Promise<void> {
  try {
    await clearAllDeviceNotifications();

    const enabledHabits = await db
      .select()
      .from(habits)
      .where(
        and(eq(habits.userId, userId), eq(habits.isNotificationsEnabled, true)),
      );

    for (const habit of enabledHabits) {
      const newId = await scheduleHabitNotification(habit);
      await db
        .update(habits)
        .set({ notificationId: newId })
        .where(eq(habits.id, habit.id));
    }
  } catch (err) {
    console.error("[NotificationService] syncUser error:", err);
  }
}
