import { checkComboSameDayCondition } from "../helpers/achievementLogic";
import {
  SECRET_ACHIEVEMENTS,
  type ComboSameDayCondition,
} from "../../constants/secretAchievements";

// ---------------------------------------------------------------------------
// SECRET_ACHIEVEMENTS catalog integrity
// ---------------------------------------------------------------------------
describe("SECRET_ACHIEVEMENTS catalog", () => {
  it("has no duplicate IDs", () => {
    const ids = SECRET_ACHIEVEMENTS.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("every achievement has a non-empty id, icon, and type", () => {
    SECRET_ACHIEVEMENTS.forEach((a) => {
      expect(a.id.length).toBeGreaterThan(0);
      expect(a.icon.length).toBeGreaterThan(0);
      expect(["total_preset", "combo_same_day", "any_custom"]).toContain(
        a.type,
      );
    });
  });

  it("all combo_same_day achievements have at least 2 preset names", () => {
    const combos = SECRET_ACHIEVEMENTS.filter(
      (a) => a.type === "combo_same_day",
    );
    combos.forEach((a) => {
      const condition = a.condition as ComboSameDayCondition;
      expect(condition.presetNames.length).toBeGreaterThanOrEqual(2);
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

// ---------------------------------------------------------------------------
// checkComboSameDayCondition — verify against actual achievement definitions
// ---------------------------------------------------------------------------
describe("checkComboSameDayCondition — real achievement conditions", () => {
  function getComboPresets(id: string): string[] {
    const achievement = SECRET_ACHIEVEMENTS.find((a) => a.id === id);
    if (!achievement || achievement.type !== "combo_same_day") {
      throw new Error(`Achievement ${id} not found or wrong type`);
    }
    return (achievement.condition as ComboSameDayCondition).presetNames;
  }

  it("unlocks good_night when Iltapalan syönti, Hampaiden pesu and Nukkumaan meno are all done", () => {
    const required = getComboPresets("good_night");
    expect(checkComboSameDayCondition(required, required)).toBe(true);
  });

  it("does not unlock good_night when Nukkumaan meno is missing", () => {
    const required = getComboPresets("good_night");
    const completed = required.filter((p) => p !== "Nukkumaan meno");
    expect(checkComboSameDayCondition(completed, required)).toBe(false);
  });

  it("unlocks spa_day when Sauna, Suihku and Rentoutus are all done", () => {
    const required = getComboPresets("spa_day");
    expect(checkComboSameDayCondition(required, required)).toBe(true);
  });
});
