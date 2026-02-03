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
  Päivärutiinit: ["Sängyn petaus", "Hampaiden pesu", "Suihku"],
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
};

/**
 * Seeds preset categories and items into the database
 * Only runs if the preset_categories table is empty
 */
export async function seedPresets(): Promise<void> {
  try {
    // Check if presets already exist
    const existingCategories = await db.select().from(presetCategories);

    if (existingCategories.length > 0) {
      // Already seeded
      return;
    }

    console.log("Seeding preset categories and items...");

    // Insert categories and their items
    for (const [categoryLabel, items] of Object.entries(PRESET_DATA)) {
      // Insert category
      const [category] = await db
        .insert(presetCategories)
        .values({ label: categoryLabel })
        .returning();

      // Insert items for this category
      for (const itemName of items) {
        await db.insert(presetItems).values({
          categoryId: category.id,
          name: itemName,
        });
      }
    }

    console.log("Preset seeding completed successfully");
  } catch (error) {
    console.error("Error seeding presets:", error);
    // Don't throw - allow app to continue even if seeding fails
  }
}
