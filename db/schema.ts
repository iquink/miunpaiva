import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Habits table
export const habits = sqliteTable("habits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type", { enum: ["boolean", "counter"] }).notNull(),
  dailyGoal: integer("daily_goal"),
  unit: text("unit"),
  category: text("category"), // Category from preset
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Logs table
export const logs = sqliteTable(
  "logs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    habitId: integer("habit_id")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),
    date: text("date").notNull(), // Format: 'YYYY-MM-DD'
    value: integer("value").notNull().default(0),
    completed: integer("completed", { mode: "boolean" })
      .notNull()
      .default(false),
  },
  (table) => ({
    habitDateIdx: index("habit_date_idx").on(table.habitId, table.date),
  }),
);

// Achievements table (refactored - now just a container/badge)
export const achievements = sqliteTable("achievements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  iconSlug: text("icon_slug").notNull().default("medal"),
});

// Achievement Criteria table (NEW - multi-criteria system)
export const achievementCriteria = sqliteTable("achievement_criteria", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  achievementId: integer("achievement_id")
    .notNull()
    .references(() => achievements.id, { onDelete: "cascade" }),
  habitId: integer("habit_id")
    .notNull()
    .references(() => habits.id, { onDelete: "cascade" }),
  ruleType: text("rule_type", {
    enum: ["streak", "total_count", "sum_value"],
  }).notNull(),
  targetValue: integer("target_value").notNull(),
  daysPeriod: integer("days_period").notNull().default(0), // 0 = all time
});

// User achievements (unlocked status)
export const userAchievements = sqliteTable("user_achievements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  achievementId: integer("achievement_id")
    .notNull()
    .references(() => achievements.id, { onDelete: "cascade" }),
  unlockedAt: integer("unlocked_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Preset Categories table
export const presetCategories = sqliteTable("preset_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
});

// Preset Items table
export const presetItems = sqliteTable("preset_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => presetCategories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;

export type Log = typeof logs.$inferSelect;
export type NewLog = typeof logs.$inferInsert;

export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;

export type AchievementCriterion = typeof achievementCriteria.$inferSelect;
export type NewAchievementCriterion = typeof achievementCriteria.$inferInsert;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type NewUserAchievement = typeof userAchievements.$inferInsert;

export type PresetCategory = typeof presetCategories.$inferSelect;
export type NewPresetCategory = typeof presetCategories.$inferInsert;

export type PresetItem = typeof presetItems.$inferSelect;
export type NewPresetItem = typeof presetItems.$inferInsert;
