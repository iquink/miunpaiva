import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as schema from "./schema";

const expo = openDatabaseSync("habit_tracker.db", {
  enableChangeListener: true,
});
export const db = drizzle(expo, { schema });

export function useDatabaseMigrations() {
  return useMigrations(db, require("../drizzle/migrations"));
}
