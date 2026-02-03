import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as schema from "./schema";

// 1. Импортируем миграции явно
// Обратите внимание: путь должен указывать на ФАЙЛ migrations.js
// Обычно он лежит внутри папки migrations и называется так же.
import migrations from "../drizzle/migrations";

const expo = openDatabaseSync("habit_tracker.db", {
  enableChangeListener: true,
});

export const db = drizzle(expo, { schema });

export function useDatabaseMigrations() {
  // 2. Передаем импортированный объект
  return useMigrations(db, migrations);
}
