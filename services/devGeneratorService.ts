import { eq } from "drizzle-orm";
import i18next from "i18next";
import { db } from "../db";

import { habits, logs } from "../db/schema";

const CUSTOM_TITLES = [
  "Read 10 pages",
  "Drink 2L water",
  "Call family",
  "Stretch for 10 min",
  "Meditate",
  "Journal entry",
  "No social media",
  "Cold shower",
  "Gratitude list",
  "Evening walk",
];

const PRESET_IDS = [
  "preset_gym",
  "preset_walking",
  "preset_running",
  "preset_make_bed",
  "preset_breakfast",
  "preset_hydration",
];

const CATEGORIES = [
  "cat_group_activities",
  "cat_exercise",
  "cat_daily_routines",
  "cat_daily_rhythm",
  "cat_nutrition",
  "cat_cleaning",
  "cat_responsibilities",
];

const TIME_OF_DAY = [
  "morning",
  "late_morning",
  "afternoon",
  "evening",
  "all_day",
] as const;

export async function generateMockHabits(
  userId: number,
  count: number,
): Promise<void> {
  const entries: any[] = [];

  for (let i = 0; i < count; i++) {
    const isPreset = Math.random() < 0.5;
    const isCounter = Math.random() < 0.2; // 20% chance to be a counter habit
    const timeOfDay =
      TIME_OF_DAY[Math.floor(Math.random() * TIME_OF_DAY.length)];
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

    if (isPreset) {
      const presetName =
        PRESET_IDS[Math.floor(Math.random() * PRESET_IDS.length)];
      entries.push({
        userId,
        title: i18next.t(presetName), // Fallback title is the preset ID
        type: isCounter ? "counter" : "boolean",
        dailyGoal: isCounter ? Math.floor(Math.random() * 5) + 2 : null,
        presetName,
        category,
        timeOfDay,
        frequency: "daily",
      });
    } else {
      const title =
        CUSTOM_TITLES[Math.floor(Math.random() * CUSTOM_TITLES.length)];
      entries.push({
        userId,
        title,
        type: isCounter ? "counter" : "boolean",
        dailyGoal: isCounter ? Math.floor(Math.random() * 5) + 2 : null,
        presetName: null,
        category,
        timeOfDay,
        frequency: "daily",
      });
    }
  }

  await db.insert(habits).values(entries);
}

export async function generateMockLogs(
  userId: number,
  count: number,
  targetHabitId?: number,
): Promise<void> {
  let userHabits = await db
    .select({ id: habits.id })
    .from(habits)
    .where(eq(habits.userId, userId));

  if (targetHabitId !== undefined) {
    userHabits = userHabits.filter((h) => h.id === targetHabitId);
  }

  if (userHabits.length === 0) {
    throw new Error("NO_HABITS");
  }

  const entries: any[] = [];
  const uniqueTracker = new Set<string>();

  // Safety guard against infinite loop if user requests 1000 logs for 1 habit
  let maxAttempts = count * 3;
  let attempts = 0;

  while (entries.length < count && attempts < maxAttempts) {
    attempts++;
    const habit = userHabits[Math.floor(Math.random() * userHabits.length)];
    const randomDate = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    );
    const dateStr = randomDate.toISOString().split("T")[0];

    // Check for duplicates!
    const key = `${habit.id}_${dateStr}`;
    if (!uniqueTracker.has(key)) {
      uniqueTracker.add(key);
      entries.push({
        habitId: habit.id,
        date: dateStr,
        value: 1,
        completed: true,
      });
    }
  }

  if (entries.length > 0) {
    await db.insert(logs).values(entries);
  }
}
