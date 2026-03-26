import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  users,
  habits,
  logs,
  presetCategories,
} from "../db/schema";
import { seedPresets } from "../db/seedPresets";

/**
 * Wipes all user data and preset catalog, re-seeds presets, then signs out.
 * Cascade deletes on `users` remove habits, logs, achievements,
 * userAchievements, and userSecretAchievements automatically.
 * Cascade deletes on `presetCategories` remove presetItems automatically.
 */
export async function wipeDatabaseAndSignOut(
  logout: () => Promise<void>,
): Promise<void> {
  await db.delete(users);
  await db.delete(presetCategories);
  await seedPresets();
  await logout();
}

/**
 * Seeds 50 mock habit logs distributed randomly over the last 30 days
 * for the given user. Throws "NO_HABITS" if the user has no habits yet.
 */
export async function seedMockLogs(userId: number): Promise<void> {
  const userHabits = await db
    .select({ id: habits.id, type: habits.type, dailyGoal: habits.dailyGoal })
    .from(habits)
    .where(eq(habits.userId, userId));

  if (userHabits.length === 0) {
    throw new Error("NO_HABITS");
  }

  const entries: {
    habitId: number;
    date: string;
    value: number;
    completed: boolean;
  }[] = [];

  for (let i = 0; i < 50; i++) {
    const habit = userHabits[Math.floor(Math.random() * userHabits.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const date = d.toISOString().split("T")[0]; // 'YYYY-MM-DD'
    const value = habit.type === "counter" ? (habit.dailyGoal ?? 1) : 1;
    entries.push({ habitId: habit.id, date, value, completed: true });
  }

  await db.insert(logs).values(entries);
}
