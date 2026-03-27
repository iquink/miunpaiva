import { checkComboSameDayCondition } from "../helpers/achievementLogic";
import { SECRET_ACHIEVEMENTS_CATALOG } from "../../constants/secretAchievements";

// ---------------------------------------------------------------------------
// SECRET_ACHIEVEMENTS_CATALOG integrity
// ---------------------------------------------------------------------------
describe("SECRET_ACHIEVEMENTS_CATALOG catalog", () => {
  it("has no duplicate IDs", () => {
    const ids = SECRET_ACHIEVEMENTS_CATALOG.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("every achievement has a non-empty id, icon, titleKey, and descKey", () => {
    SECRET_ACHIEVEMENTS_CATALOG.forEach((a) => {
      expect(a.id.length).toBeGreaterThan(0);
      expect(a.icon.length).toBeGreaterThan(0);
      expect(a.titleKey.length).toBeGreaterThan(0);
      expect(a.descKey.length).toBeGreaterThan(0);
    });
  });

  it("every achievement has a valid preset_count requirement", () => {
    SECRET_ACHIEVEMENTS_CATALOG.forEach((a) => {
      expect(a.requirement.type).toBe("preset_count");
      expect(a.requirement.presetName.length).toBeGreaterThan(0);
      expect(a.requirement.count).toBeGreaterThan(0);
    });
  });

  it("tiers for each preset are in ascending order", () => {
    const byPreset: Record<string, number[]> = {};
    SECRET_ACHIEVEMENTS_CATALOG.forEach((a) => {
      const { presetName, count } = a.requirement;
      (byPreset[presetName] ??= []).push(count);
    });
    Object.values(byPreset).forEach((counts) => {
      for (let i = 1; i < counts.length; i++) {
        expect(counts[i]).toBeGreaterThan(counts[i - 1]);
      }
    });
  });
});

// ---------------------------------------------------------------------------
// checkComboSameDayCondition — core logic
// ---------------------------------------------------------------------------
describe("checkComboSameDayCondition", () => {
  // The "perfect_morning" achievement requires all three presets:
  const perfectMorningPresets = [
    "Sängyn petaus",
    "Hampaiden pesu",
    "Aamupalan syönti",
  ];

  it("returns true when all required presets were completed", () => {
    expect(
      checkComboSameDayCondition(
        ["Sängyn petaus", "Hampaiden pesu", "Aamupalan syönti"],
        perfectMorningPresets,
      ),
    ).toBe(true);
  });

  it("returns true when extra presets were completed alongside required ones", () => {
    expect(
      checkComboSameDayCondition(
        [
          "Sängyn petaus",
          "Hampaiden pesu",
          "Aamupalan syönti",
          "Kuntosali", // bonus habit — should not disqualify
          "Ulkoilu",
        ],
        perfectMorningPresets,
      ),
    ).toBe(true);
  });

  it("returns false when one required preset is missing", () => {
    expect(
      checkComboSameDayCondition(
        ["Sängyn petaus", "Hampaiden pesu"], // missing "Aamupalan syönti"
        perfectMorningPresets,
      ),
    ).toBe(false);
  });

  it("returns false when no presets were completed at all", () => {
    expect(checkComboSameDayCondition([], perfectMorningPresets)).toBe(false);
  });

  it("returns false when completely unrelated presets were completed", () => {
    expect(
      checkComboSameDayCondition(
        ["Kuntosali", "Juoksu", "Sauna"],
        perfectMorningPresets,
      ),
    ).toBe(false);
  });

  it("returns true vacuously when required list is empty", () => {
    // Edge case: Array.every() on an empty array is always true
    expect(checkComboSameDayCondition(["Kuntosali"], [])).toBe(true);
  });

  it("is case-sensitive (incomplete match does not count)", () => {
    expect(
      checkComboSameDayCondition(
        ["sängyn petaus", "hampaiden pesu", "aamupalan syönti"], // wrong case
        perfectMorningPresets,
      ),
    ).toBe(false);
  });
});
