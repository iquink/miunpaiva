import { calculateLevelData, getRankKey } from "../helpers/rpgCalculations";

// ---------------------------------------------------------------------------
// getRankKey
// ---------------------------------------------------------------------------
describe("getRankKey", () => {
  it("returns novice for level 1 (brand-new user)", () => {
    expect(getRankKey(1)).toBe("rpg_ranks.novice");
  });

  it("returns novice for level 4 (just below adept threshold)", () => {
    expect(getRankKey(4)).toBe("rpg_ranks.novice");
  });

  it("returns adept for level 5", () => {
    expect(getRankKey(5)).toBe("rpg_ranks.adept");
  });

  it("returns master for level 10", () => {
    expect(getRankKey(10)).toBe("rpg_ranks.master");
  });

  it("returns expert for level 15", () => {
    expect(getRankKey(15)).toBe("rpg_ranks.expert");
  });

  it("returns hero for level 20", () => {
    expect(getRankKey(20)).toBe("rpg_ranks.hero");
  });

  it("returns legend for level 25", () => {
    expect(getRankKey(25)).toBe("rpg_ranks.legend");
  });
});

// ---------------------------------------------------------------------------
// calculateLevelData — level boundaries
// ---------------------------------------------------------------------------
describe("calculateLevelData — level thresholds", () => {
  it("0 completions → level 1 (new user starts at level 1)", () => {
    expect(calculateLevelData(0).level).toBe(1);
  });

  it("1 completion → level 2 (sqrt(1)=1, floor+1=2)", () => {
    expect(calculateLevelData(1).level).toBe(2);
  });

  it("3 completions → still level 2 (sqrt(3)≈1.73)", () => {
    expect(calculateLevelData(3).level).toBe(2);
  });

  it("4 completions → level 3 (sqrt(4)=2, floor+1=3)", () => {
    expect(calculateLevelData(4).level).toBe(3);
  });

  it("8 completions → still level 3 (sqrt(8)≈2.83)", () => {
    expect(calculateLevelData(8).level).toBe(3);
  });

  it("9 completions → level 4 (sqrt(9)=3, floor+1=4)", () => {
    expect(calculateLevelData(9).level).toBe(4);
  });

  it("99 completions → level 10 (sqrt(99)≈9.95, floor+1=10)", () => {
    expect(calculateLevelData(99).level).toBe(10);
  });

  it("100 completions → level 11 (sqrt(100)=10, floor+1=11)", () => {
    expect(calculateLevelData(100).level).toBe(11);
  });
});

// ---------------------------------------------------------------------------
// calculateLevelData — nextLevelAt
// ---------------------------------------------------------------------------
describe("calculateLevelData — nextLevelAt", () => {
  it("level 1 requires 1 completion to advance (1^2 = 1)", () => {
    expect(calculateLevelData(0).nextLevelAt).toBe(1);
  });

  it("level 2 requires 4 completions to advance (2^2 = 4)", () => {
    expect(calculateLevelData(1).nextLevelAt).toBe(4);
  });

  it("level 3 requires 9 completions to advance (3^2 = 9)", () => {
    expect(calculateLevelData(4).nextLevelAt).toBe(9);
  });

  it("level 10 requires 100 completions to advance (10^2 = 100)", () => {
    expect(calculateLevelData(99).nextLevelAt).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// calculateLevelData — progressPercent
// ---------------------------------------------------------------------------
describe("calculateLevelData — progressPercent", () => {
  it("0 completions → 0% progress within level 1", () => {
    // range = 1^2 - 0^2 = 1; progress = 0/1 = 0%
    expect(calculateLevelData(0).progressPercent).toBe(0);
  });

  it("just reaching level 2 → 0% progress (no tasks done in new level yet)", () => {
    // At exactly 1 completion, you've just hit level 2 with no surplus
    expect(calculateLevelData(1).progressPercent).toBe(0);
  });

  it("3 completions → 66% progress through level 2 (2 of 3 required done)", () => {
    // range = 4 - 1 = 3; done in level = 3 - 1 = 2; 2/3 ≈ 66%
    expect(calculateLevelData(3).progressPercent).toBe(66);
  });

  it("just reaching level 3 → 0% progress", () => {
    // At exactly 4 completions level floor(sqrt(4))+1=3; currentReq=4; surplus=0
    expect(calculateLevelData(4).progressPercent).toBe(0);
  });

  it("8 completions → 80% progress through level 3 (4 of 5 required done)", () => {
    // range = 9 - 4 = 5; done = 8 - 4 = 4; 4/5 = 80%
    expect(calculateLevelData(8).progressPercent).toBe(80);
  });

  it("99 completions → 94% progress through level 10 (18 of 19 required done)", () => {
    // range = 100 - 81 = 19; done = 99 - 81 = 18; floor(18/19*100) = 94
    expect(calculateLevelData(99).progressPercent).toBe(94);
  });

  it("progressPercent is capped at 100", () => {
    // Sanity: no value should ever exceed 100
    [0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100].forEach((n) => {
      expect(calculateLevelData(n).progressPercent).toBeLessThanOrEqual(100);
    });
  });
});

// ---------------------------------------------------------------------------
// calculateLevelData — rankKey integration
// ---------------------------------------------------------------------------
describe("calculateLevelData — rankKey", () => {
  it("low-count user gets novice rank", () => {
    expect(calculateLevelData(0).rankKey).toBe("rpg_ranks.novice");
    expect(calculateLevelData(15).rankKey).toBe("rpg_ranks.novice"); // level 4
  });

  it("99 completions (level 10) gives master rank", () => {
    expect(calculateLevelData(99).rankKey).toBe("rpg_ranks.master");
  });
});
