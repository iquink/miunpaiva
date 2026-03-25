/**
 * Pure achievement condition logic.
 * No database or native module dependencies — safe to import in unit tests.
 */

/**
 * Returns true when every preset name in `requiredPresetNames` is present
 * in `completedPresetNames`.  Extra completed presets are ignored.
 */
export function checkComboSameDayCondition(
  completedPresetNames: string[],
  requiredPresetNames: string[],
): boolean {
  const completed = new Set(completedPresetNames);
  return requiredPresetNames.every((name) => completed.has(name));
}
