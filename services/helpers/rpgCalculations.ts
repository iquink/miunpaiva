/**
 * Pure RPG level calculation functions.
 * No database or native module dependencies — safe to import in unit tests.
 */

export function getRankKey(level: number): string {
  if (level >= 25) return "rpg_ranks.legend";
  if (level >= 20) return "rpg_ranks.hero";
  if (level >= 15) return "rpg_ranks.expert";
  if (level >= 10) return "rpg_ranks.master";
  if (level >= 5) return "rpg_ranks.adept";
  return "rpg_ranks.novice";
}

export interface LevelData {
  level: number;
  rankKey: string;
  progressPercent: number;
  nextLevelAt: number;
}

/**
 * Calculate RPG level data from a raw completed-task count.
 * Formula: Level = floor(sqrt(totalCompleted)) + 1
 * Progress is the percentage toward the next level threshold (n^2).
 */
export function calculateLevelData(totalCompleted: number): LevelData {
  const level = Math.floor(Math.sqrt(totalCompleted)) + 1;
  const rankKey = getRankKey(level);

  const currentLevelRequirement = Math.pow(level - 1, 2);
  const nextLevelRequirement = Math.pow(level, 2);
  const progressInLevel = totalCompleted - currentLevelRequirement;
  const levelRange = nextLevelRequirement - currentLevelRequirement;
  const progressPercent = Math.min(
    100,
    Math.floor((progressInLevel / levelRange) * 100),
  );

  return { level, rankKey, progressPercent, nextLevelAt: nextLevelRequirement };
}
