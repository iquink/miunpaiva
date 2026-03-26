import { eq, inArray } from "drizzle-orm";
import { habits } from "../db/schema";
import type { SQLiteDatabase } from "expo-sqlite";

// ─── Preset item mapping: old Finnish string → new string ID ─────────────────
export const OLD_TO_NEW_PRESETS: Record<string, string> = {
  // cat_group_activities
  Askartelu: "preset_crafts",
  Puutyöt: "preset_woodwork",
  Ulkoilu: "preset_outdoor_activity",
  Lenkki: "preset_walk",
  Laulu: "preset_singing",
  Seurakunta: "preset_congregation",
  Musiikki: "preset_music",
  Bingo: "preset_bingo",
  Taide: "preset_art",
  Peli: "preset_games",
  Rentoutus: "preset_relaxation",
  Disco: "preset_disco",
  "Vapaamuotoinen teksti": "preset_free_text",
  // cat_exercise
  Kävely: "preset_walking",
  Jumppa: "preset_gymnastics",
  Kuntosali: "preset_gym",
  Juoksu: "preset_running",
  // cat_daily_routines
  "Sängyn petaus": "preset_make_bed",
  "Hampaiden pesu": "preset_teeth_brush",
  Suihku: "preset_shower",
  Sauna: "preset_sauna",
  "Lääkkeiden otto": "preset_medication",
  "Parran ajo": "preset_shaving",
  Pyykinpesu: "preset_laundry",
  // cat_daily_rhythm
  "Nukkumaan meno": "preset_bedtime",
  Herätys: "preset_wake_up",
  Lepo: "preset_rest",
  // cat_nutrition
  "Aamupalan syönti": "preset_breakfast",
  "Lounaan syönti": "preset_lunch",
  "Päivällisen syönti": "preset_dinner",
  "Iltapalan syönti": "preset_evening_snack",
  Herkuttelu: "preset_treats",
  "Nesteytys/veden juonti": "preset_hydration",
  // cat_cleaning
  "Oman huoneen siivous": "preset_room_cleaning",
  "Tavaroiden järjestely": "preset_organizing",
  // cat_responsibilities
  Keittiö: "preset_kitchen_duty",
  // "Siivous" as an item under Vastuutehtävä (category Siivous is handled separately)
  Siivous: "preset_cleaning_duty",
};

// ─── Category mapping: old Finnish label → new string ID ─────────────────────
export const OLD_TO_NEW_CATEGORIES: Record<string, string> = {
  Ryhmätoiminta: "cat_group_activities",
  Liikunta: "cat_exercise",
  Päivärutiinit: "cat_daily_routines",
  Vuorokausirytmi: "cat_daily_rhythm",
  Ravitsemus: "cat_nutrition",
  Siivous: "cat_cleaning",
  Vastuutehtävä: "cat_responsibilities",
};

/**
 * Migrates existing habits rows from old Finnish preset/category strings
 * to the new string IDs. Safe to run multiple times (idempotent for already-
 * migrated rows since they won't match any key in the mapping objects).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function migrateOldPresets(db: any): Promise<void> {
  try {
    console.log("[presetMigration] Starting preset name migration...");

    // ── Migrate presetName ───────────────────────────────────────────────────
    const oldPresetKeys = Object.keys(OLD_TO_NEW_PRESETS);
    if (oldPresetKeys.length > 0) {
      const habitRows = await db
        .select({ id: habits.id, presetName: habits.presetName })
        .from(habits)
        .where(inArray(habits.presetName, oldPresetKeys));

      for (const row of habitRows) {
        const newId = OLD_TO_NEW_PRESETS[row.presetName!];
        if (newId) {
          await db
            .update(habits)
            .set({ presetName: newId })
            .where(eq(habits.id, row.id));
        }
      }
      console.log(
        `[presetMigration] Migrated ${habitRows.length} presetName rows.`,
      );
    }

    // ── Migrate category ─────────────────────────────────────────────────────
    const oldCategoryKeys = Object.keys(OLD_TO_NEW_CATEGORIES);
    if (oldCategoryKeys.length > 0) {
      const categoryRows = await db
        .select({ id: habits.id, category: habits.category })
        .from(habits)
        .where(inArray(habits.category, oldCategoryKeys));

      for (const row of categoryRows) {
        const newId = OLD_TO_NEW_CATEGORIES[row.category!];
        if (newId) {
          await db
            .update(habits)
            .set({ category: newId })
            .where(eq(habits.id, row.id));
        }
      }
      console.log(
        `[presetMigration] Migrated ${categoryRows.length} category rows.`,
      );
    }

    console.log("[presetMigration] Migration completed successfully.");
  } catch (error) {
    console.error("[presetMigration] Migration error:", error);
    // Don't throw — allow the app to continue if migration fails
  }
}
