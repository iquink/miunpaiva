import { eq, and } from "drizzle-orm";
import { db } from "./index";
import { presetCategories, presetItems } from "./schema";

// Finnish preset data
const PRESET_DATA = {
  Ryhmätoiminta: [
    "Askartelu",
    "Puutyöt",
    "Ulkoilu",
    "Lenkki",
    "Laulu",
    "Seurakunta",
    "Musiikki",
    "Bingo",
    "Taide",
    "Peli",
    "Rentoutus",
    "Disco",
    "Vapaamuotoinen teksti",
  ],
  Liikunta: ["Kävely", "Jumppa", "Kuntosali", "Juoksu"],
  Päivärutiinit: [
    "Sängyn petaus",
    "Hampaiden pesu",
    "Suihku",
    "Sauna",
    "Lääkkeiden otto",
    "Parran ajo",
    "Pyykinpesu",
  ],
  Vuorokausirytmi: ["Nukkumaan meno", "Herätys", "Lepo"],
  Ravitsemus: [
    "Aamupalan syönti",
    "Lounaan syönti",
    "Päivällisen syönti",
    "Iltapalan syönti",
    "Herkuttelu",
    "Nesteytys/veden juonti",
  ],
  Siivous: ["Oman huoneen siivous", "Tavaroiden järjestely"],
  Vastuutehtävä: ["Keittiö", "Siivous"],
};

/**
 * Seeds preset categories and items into the database
 * Uses smart sync: adds new categories/items without wiping existing data
 */
export async function seedPresets(): Promise<void> {
  try {
    console.log("Syncing preset categories and items...");

    // Iterate through all categories in the JSON
    for (const [categoryLabel, items] of Object.entries(PRESET_DATA)) {
      // Check if category already exists
      const [existingCategory] = await db
        .select()
        .from(presetCategories)
        .where(eq(presetCategories.label, categoryLabel));

      let categoryId: number;

      if (!existingCategory) {
        // Category doesn't exist - insert it
        const [newCategory] = await db
          .insert(presetCategories)
          .values({ label: categoryLabel })
          .returning();
        categoryId = newCategory.id;
        console.log(`✓ Added new category: ${categoryLabel}`);
      } else {
        // Category exists - use its ID
        categoryId = existingCategory.id;
      }

      // Now sync items for this category
      for (const itemName of items) {
        // Check if this item already exists for this category
        const [existingItem] = await db
          .select()
          .from(presetItems)
          .where(
            and(
              eq(presetItems.categoryId, categoryId),
              eq(presetItems.name, itemName),
            ),
          );

        if (!existingItem) {
          // Item doesn't exist - insert it
          await db.insert(presetItems).values({
            categoryId: categoryId,
            name: itemName,
          });
          console.log(`  ✓ Added new item: ${itemName}`);
        }
      }
    }

    console.log("Preset sync completed successfully");
  } catch (error) {
    console.error("Error syncing presets:", error);
    // Don't throw - allow app to continue even if seeding fails
  }
}
