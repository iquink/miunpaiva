import { eq, inArray } from "drizzle-orm";
import i18next from "i18next";
import { db } from "../db";
import { useDevLogStore } from "../store/devLogStore";

import {
  habits,
  logs,
  achievements,
  userSecretAchievements,
} from "../db/schema";
import { SECRET_ACHIEVEMENTS } from "../constants/secretAchievements";

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

export async function wipeUserData(userId: number): Promise<void> {
  const { addLog } = useDevLogStore.getState();
  addLog(`Wiping all data for user ${userId}...`);
  // Delete habits first — cascades to logs and achievementCriteria
  await db.delete(habits).where(eq(habits.userId, userId));
  // Delete custom achievements — cascades to userAchievements and achievementCriteria
  await db.delete(achievements).where(eq(achievements.userId, userId));
  // Delete secret achievement unlocks
  await db
    .delete(userSecretAchievements)
    .where(eq(userSecretAchievements.userId, userId));
  addLog(`Wipe complete for user ${userId}.`);
}

export async function generateMockHabits(
  userId: number,
  count: number,
): Promise<void> {
  const { addLog } = useDevLogStore.getState();
  addLog(`Starting mock habits generation (count=${count})...`);
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
  addLog(`Successfully inserted ${entries.length} mock habit(s).`);
}

export async function generateMockLogs(
  userId: number,
  count: number,
  targetHabitId?: number,
): Promise<void> {
  const { addLog } = useDevLogStore.getState();
  addLog(`Starting mock logs generation (count=${count})...`);
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
  addLog(`Successfully inserted ${entries.length} mock log(s).`);
}

// RPG category names that map 1-to-1 with the 7 RPG stat categories
const RPG_CATEGORIES = [
  "cat_exercise",
  "cat_nutrition",
  "cat_daily_routines",
  "cat_daily_rhythm",
  "cat_cleaning",
  "cat_responsibilities",
  "cat_group_activities",
] as const;

export async function boostRPGStats(userId: number): Promise<void> {
  const { addLog } = useDevLogStore.getState();
  addLog(`Boosting RPG stats for user ${userId}...`);
  // Insert one boolean habit per RPG category
  const habitRows = RPG_CATEGORIES.map((category) => ({
    userId,
    title: `[DEV] ${category}`,
    type: "boolean" as const,
    dailyGoal: null,
    presetName: null,
    category,
    timeOfDay: "all_day" as const,
    frequency: "daily" as const,
  }));

  const inserted = await db
    .insert(habits)
    .values(habitRows)
    .returning({ id: habits.id });

  // Build 50 log entries per habit, one per day for the last 50 days
  const logEntries: {
    habitId: number;
    date: string;
    value: number;
    completed: boolean;
  }[] = [];

  const today = new Date();
  for (const { id: habitId } of inserted) {
    for (let daysAgo = 0; daysAgo < 50; daysAgo++) {
      const d = new Date(today);
      d.setDate(today.getDate() - daysAgo);
      const dateStr = d.toISOString().split("T")[0];
      logEntries.push({ habitId, date: dateStr, value: 1, completed: true });
    }
  }

  await db.insert(logs).values(logEntries);
  addLog(`RPG boost complete: ${inserted.length} habits × 50 days inserted.`);
}

export async function unlockAllSecretAchievements(
  userId: number,
): Promise<void> {
  const { addLog } = useDevLogStore.getState();
  addLog(`Unlocking all secret achievements for user ${userId}...`);
  // Find which secret achievements the user already has
  const existing = await db
    .select({ secretAchievementId: userSecretAchievements.secretAchievementId })
    .from(userSecretAchievements)
    .where(eq(userSecretAchievements.userId, userId));

  const alreadyUnlocked = new Set(existing.map((r) => r.secretAchievementId));

  const toInsert = SECRET_ACHIEVEMENTS.filter(
    (a) => !alreadyUnlocked.has(a.id),
  ).map((a) => ({
    userId,
    secretAchievementId: a.id,
    unlockedAt: new Date(),
  }));

  if (toInsert.length > 0) {
    await db.insert(userSecretAchievements).values(toInsert);
  }
  addLog(
    `Unlocked ${toInsert.length} secret achievement(s) (${alreadyUnlocked.size} already owned).`,
  );
}
