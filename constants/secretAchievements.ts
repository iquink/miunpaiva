export type TotalPresetCondition = {
  presetName: string;
  target: number;
};

export type ComboSameDayCondition = {
  presetNames: string[];
};

export type SecretAchievement = {
  id: string;
  icon: string;
  type: "total_preset" | "combo_same_day" | "any_custom";
  condition:
    | TotalPresetCondition
    | ComboSameDayCondition
    | Record<string, never>;
};

export const SECRET_ACHIEVEMENTS: SecretAchievement[] = [
  // ==========================================
  // 💧 total_preset
  // ==========================================
  {
    id: "aquaman",
    icon: "💧",
    type: "total_preset",
    condition: { presetName: "Nesteytys/veden juonti", target: 100 },
  },
  {
    id: "ironman",
    icon: "🏋️",
    type: "total_preset",
    condition: { presetName: "Kuntosali", target: 50 },
  },
  {
    id: "sauna_master",
    icon: "🧖",
    type: "total_preset",
    condition: { presetName: "Sauna", target: 50 },
  },
  {
    id: "bingo_champion",
    icon: "🎱",
    type: "total_preset",
    condition: { presetName: "Bingo", target: 20 },
  },
  {
    id: "picasso",
    icon: "🎨",
    type: "total_preset",
    condition: { presetName: "Taide", target: 30 },
  },
  {
    id: "disco_king",
    icon: "🕺",
    type: "total_preset",
    condition: { presetName: "Disco", target: 10 },
  },
  {
    id: "forest_spirit",
    icon: "🌲",
    type: "total_preset",
    condition: { presetName: "Ulkoilu", target: 100 },
  },
  {
    id: "zen_master",
    icon: "🧘",
    type: "total_preset",
    condition: { presetName: "Rentoutus", target: 30 },
  },
  {
    id: "clean_smile",
    icon: "🦷",
    type: "total_preset",
    condition: { presetName: "Hampaiden pesu", target: 100 },
  },
  {
    id: "marathoner",
    icon: "🏃",
    type: "total_preset",
    condition: { presetName: "Juoksu", target: 50 },
  },
  {
    id: "health_first",
    icon: "💊",
    type: "total_preset",
    condition: { presetName: "Lääkkeiden otto", target: 100 },
  },

  // ==========================================
  // 🌪 combo_same_day
  // ==========================================
  {
    id: "perfect_morning",
    icon: "🌅",
    type: "combo_same_day",
    condition: {
      presetNames: ["Sängyn petaus", "Hampaiden pesu", "Aamupalan syönti"],
    },
  },
  {
    id: "good_night",
    icon: "🌙",
    type: "combo_same_day",
    condition: {
      presetNames: ["Iltapalan syönti", "Hampaiden pesu", "Nukkumaan meno"],
    },
  },
  {
    id: "perfect_diet",
    icon: "🥗",
    type: "combo_same_day",
    condition: {
      presetNames: [
        "Aamupalan syönti",
        "Lounaan syönti",
        "Päivällisen syönti",
        "Iltapalan syönti",
      ],
    },
  },
  {
    id: "spring_cleaning",
    icon: "✨",
    type: "combo_same_day",
    condition: {
      presetNames: [
        "Oman huoneen siivous",
        "Tavaroiden järjestely",
        "Pyykinpesu",
      ],
    },
  },
  {
    id: "spa_day",
    icon: "🧖‍♀️",
    type: "combo_same_day",
    condition: {
      presetNames: ["Sauna", "Suihku", "Rentoutus"],
    },
  },
  {
    id: "active_day",
    icon: "💪",
    type: "combo_same_day",
    condition: {
      presetNames: ["Ulkoilu", "Jumppa", "Suihku"],
    },
  },
];
