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
    condition: { presetName: "preset_hydration", target: 100 },
  },
  {
    id: "ironman",
    icon: "🏋️",
    type: "total_preset",
    condition: { presetName: "preset_gym", target: 50 },
  },
  {
    id: "sauna_master",
    icon: "🧖",
    type: "total_preset",
    condition: { presetName: "preset_sauna", target: 50 },
  },
  {
    id: "bingo_champion",
    icon: "🎱",
    type: "total_preset",
    condition: { presetName: "preset_bingo", target: 20 },
  },
  {
    id: "picasso",
    icon: "🎨",
    type: "total_preset",
    condition: { presetName: "preset_art", target: 30 },
  },
  {
    id: "disco_king",
    icon: "🕺",
    type: "total_preset",
    condition: { presetName: "preset_disco", target: 10 },
  },
  {
    id: "forest_spirit",
    icon: "🌲",
    type: "total_preset",
    condition: { presetName: "preset_outdoor_activity", target: 100 },
  },
  {
    id: "zen_master",
    icon: "🧘",
    type: "total_preset",
    condition: { presetName: "preset_relaxation", target: 30 },
  },
  {
    id: "clean_smile",
    icon: "🦷",
    type: "total_preset",
    condition: { presetName: "preset_teeth_brush", target: 100 },
  },
  {
    id: "marathoner",
    icon: "🏃",
    type: "total_preset",
    condition: { presetName: "preset_running", target: 50 },
  },
  {
    id: "health_first",
    icon: "💊",
    type: "total_preset",
    condition: { presetName: "preset_medication", target: 100 },
  },

  // ==========================================
  // 🌪 combo_same_day
  // ==========================================
  {
    id: "perfect_morning",
    icon: "🌅",
    type: "combo_same_day",
    condition: {
      presetNames: [
        "preset_make_bed",
        "preset_teeth_brush",
        "preset_breakfast",
      ],
    },
  },
  {
    id: "good_night",
    icon: "🌙",
    type: "combo_same_day",
    condition: {
      presetNames: [
        "preset_evening_snack",
        "preset_teeth_brush",
        "preset_bedtime",
      ],
    },
  },
  {
    id: "perfect_diet",
    icon: "🥗",
    type: "combo_same_day",
    condition: {
      presetNames: [
        "preset_breakfast",
        "preset_lunch",
        "preset_dinner",
        "preset_evening_snack",
      ],
    },
  },
  {
    id: "spring_cleaning",
    icon: "✨",
    type: "combo_same_day",
    condition: {
      presetNames: [
        "preset_room_cleaning",
        "preset_organizing",
        "preset_laundry",
      ],
    },
  },
  {
    id: "spa_day",
    icon: "🧖‍♀️",
    type: "combo_same_day",
    condition: {
      presetNames: ["preset_sauna", "preset_shower", "preset_relaxation"],
    },
  },
  {
    id: "active_day",
    icon: "💪",
    type: "combo_same_day",
    condition: {
      presetNames: [
        "preset_outdoor_activity",
        "preset_gymnastics",
        "preset_shower",
      ],
    },
  },
];
