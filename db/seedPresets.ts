import { eq, not, like } from "drizzle-orm";
import { db } from "./index";
import { presetCategories, presetItems } from "./schema";

// String-ID-based preset data — keys are i18n IDs
const PRESET_DATA: Record<string, string[]> = {
  cat_group_activities: [
    "preset_crafts",
    "preset_woodwork",
    "preset_outdoor_activity",
    "preset_walk",
    "preset_singing",
    "preset_congregation",
    "preset_music",
    "preset_bingo",
    "preset_art",
    "preset_games",
    "preset_relaxation",
    "preset_disco",
    "preset_free_text",
  ],
  cat_exercise: [
    "preset_walking",
    "preset_gymnastics",
    "preset_gym",
    "preset_running",
  ],
  cat_daily_routines: [
    "preset_make_bed",
    "preset_teeth_brush",
    "preset_shower",
    "preset_sauna",
    "preset_medication",
    "preset_shaving",
    "preset_laundry",
  ],
  cat_daily_rhythm: ["preset_bedtime", "preset_wake_up", "preset_rest"],
  cat_nutrition: [
    "preset_breakfast",
    "preset_lunch",
    "preset_dinner",
    "preset_evening_snack",
    "preset_treats",
    "preset_hydration",
  ],
  cat_cleaning: ["preset_room_cleaning", "preset_organizing"],
  cat_responsibilities: ["preset_kitchen_duty", "preset_cleaning_duty"],
};

const PRESET_DEFAULTS: Record<
  string,
  {
    defaultType: "boolean" | "counter";
    defaultGoal: number | null;
    defaultUnit: string | null;
  }
> = {
  preset_hydration: {
    defaultType: "counter",
    defaultGoal: 2,
    defaultUnit: "L",
  },
  preset_walking: {
    defaultType: "counter",
    defaultGoal: 30,
    defaultUnit: "min",
  },
  preset_running: { defaultType: "counter", defaultGoal: 5, defaultUnit: "km" },
  preset_medication: {
    defaultType: "counter",
    defaultGoal: 1,
    defaultUnit: "pcs",
  },
  preset_sleep: { defaultType: "counter", defaultGoal: 8, defaultUnit: "h" },
};

/**
 * Seeds preset categories and items into the database.
 * Clears existing preset data first to ensure a clean slate with the new string IDs.
 */
export async function seedPresets(): Promise<void> {
  try {
    console.log("[seedPresets] Checking preset data...");

    // ── One-time legacy cleanup ──────────────────────────────────────────────
    // Delete any category whose label is not a string ID (i.e. old Finnish strings).
    // Cascade delete removes their items automatically.
    const legacyCategories = await db
      .select({ id: presetCategories.id, label: presetCategories.label })
      .from(presetCategories)
      .where(not(like(presetCategories.label, "cat_%")));

    if (legacyCategories.length > 0) {
      for (const legacy of legacyCategories) {
        await db
          .delete(presetCategories)
          .where(eq(presetCategories.id, legacy.id));
      }
      console.log(
        `[seedPresets] Removed ${legacyCategories.length} legacy category row(s).`,
      );
    }

    // ── Smart insert ────────────────────────────────────────────────────────
    let newCategoryCount = 0;
    let newItemCount = 0;

    for (const [categoryId, itemIds] of Object.entries(PRESET_DATA)) {
      // Find or create the category row
      const [existingCategory] = await db
        .select({ id: presetCategories.id })
        .from(presetCategories)
        .where(eq(presetCategories.label, categoryId));

      let categoryRowId: number;
      if (!existingCategory) {
        const [inserted] = await db
          .insert(presetCategories)
          .values({ label: categoryId })
          .returning();
        categoryRowId = inserted.id;
        newCategoryCount++;
      } else {
        categoryRowId = existingCategory.id;
      }

      // Fetch existing item names for this category
      const existingItems = await db
        .select({ name: presetItems.name })
        .from(presetItems)
        .where(eq(presetItems.categoryId, categoryRowId));
      const existingNames = new Set(existingItems.map((i) => i.name));

      // Insert missing items; update defaults on existing ones
      for (const itemId of itemIds) {
        const defaults = PRESET_DEFAULTS[itemId] ?? {
          defaultType: "boolean" as const,
          defaultGoal: null,
          defaultUnit: null,
        };
        if (!existingNames.has(itemId)) {
          await db
            .insert(presetItems)
            .values({ categoryId: categoryRowId, name: itemId, ...defaults });
          newItemCount++;
        } else {
          await db
            .update(presetItems)
            .set(defaults)
            .where(eq(presetItems.name, itemId));
        }
      }
    }

    if (newCategoryCount === 0 && newItemCount === 0) {
      console.log("[seedPresets] All presets up-to-date, nothing to insert.");
    } else {
      console.log(
        `[seedPresets] Done — added ${newCategoryCount} category/categories and ${newItemCount} item(s).`,
      );
    }
  } catch (error) {
    console.error("[seedPresets] Error:", error);
    // Don't throw - allow app to continue even if seeding fails
  }
}
