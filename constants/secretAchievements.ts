export interface SecretAchievementDef {
  id: string;
  icon: string;
  titleKey: string;
  descKey: string;
  requirement: {
    type: "preset_count";
    presetName: string;
    count: number;
  };
}

export const SECRET_ACHIEVEMENTS_CATALOG: SecretAchievementDef[] = [
  // ==========================================
  // 🌳 WALKING (preset_walking)
  // ==========================================
  {
    id: "walker_1",
    icon: "🌳",
    titleKey: "walker_1_title",
    descKey: "walker_1_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_walking",
      count: 1,
    },
  },
  {
    id: "walker_5",
    icon: "🧭",
    titleKey: "walker_5_title",
    descKey: "walker_5_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_walking",
      count: 5,
    },
  },
  {
    id: "walker_15",
    icon: "🗺️",
    titleKey: "walker_15_title",
    descKey: "walker_15_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_walking",
      count: 15,
    },
  },
  {
    id: "walker_30",
    icon: "🏔️",
    titleKey: "walker_30_title",
    descKey: "walker_30_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_walking",
      count: 30,
    },
  },
  {
    id: "walker_100",
    icon: "🌍",
    titleKey: "walker_100_title",
    descKey: "walker_100_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_walking",
      count: 100,
    },
  },

  // ==========================================
  // 💧 HYDRATION (preset_hydration)
  // ==========================================
  {
    id: "water_1",
    icon: "💧",
    titleKey: "water_1_title",
    descKey: "water_1_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_hydration",
      count: 1,
    },
  },
  {
    id: "water_5",
    icon: "🥤",
    titleKey: "water_5_title",
    descKey: "water_5_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_hydration",
      count: 5,
    },
  },
  {
    id: "water_15",
    icon: "🧊",
    titleKey: "water_15_title",
    descKey: "water_15_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_hydration",
      count: 15,
    },
  },
  {
    id: "water_30",
    icon: "🌊",
    titleKey: "water_30_title",
    descKey: "water_30_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_hydration",
      count: 30,
    },
  },
  {
    id: "water_100",
    icon: "🔱",
    titleKey: "water_100_title",
    descKey: "water_100_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_hydration",
      count: 100,
    },
  },

  // ==========================================
  // 💊 MEDICATION (preset_medication)
  // ==========================================
  {
    id: "meds_1",
    icon: "💊",
    titleKey: "meds_1_title",
    descKey: "meds_1_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_medication",
      count: 1,
    },
  },
  {
    id: "meds_5",
    icon: "🛡️",
    titleKey: "meds_5_title",
    descKey: "meds_5_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_medication",
      count: 5,
    },
  },
  {
    id: "meds_15",
    icon: "⚕️",
    titleKey: "meds_15_title",
    descKey: "meds_15_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_medication",
      count: 15,
    },
  },
  {
    id: "meds_30",
    icon: "🏥",
    titleKey: "meds_30_title",
    descKey: "meds_30_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_medication",
      count: 30,
    },
  },
  {
    id: "meds_100",
    icon: "🦸",
    titleKey: "meds_100_title",
    descKey: "meds_100_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_medication",
      count: 100,
    },
  },

  // ==========================================
  // 🧹 ROOM CLEANING (preset_room_cleaning)
  // ==========================================
  {
    id: "clean_1",
    icon: "🧹",
    titleKey: "clean_1_title",
    descKey: "clean_1_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_room_cleaning",
      count: 1,
    },
  },
  {
    id: "clean_5",
    icon: "✨",
    titleKey: "clean_5_title",
    descKey: "clean_5_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_room_cleaning",
      count: 5,
    },
  },
  {
    id: "clean_15",
    icon: "🧼",
    titleKey: "clean_15_title",
    descKey: "clean_15_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_room_cleaning",
      count: 15,
    },
  },
  {
    id: "clean_30",
    icon: "💎",
    titleKey: "clean_30_title",
    descKey: "clean_30_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_room_cleaning",
      count: 30,
    },
  },
  {
    id: "clean_100",
    icon: "🪄",
    titleKey: "clean_100_title",
    descKey: "clean_100_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_room_cleaning",
      count: 100,
    },
  },

  // ==========================================
  // 🌙 BEDTIME (preset_bedtime)
  // ==========================================
  {
    id: "sleep_1",
    icon: "🌙",
    titleKey: "sleep_1_title",
    descKey: "sleep_1_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_bedtime",
      count: 1,
    },
  },
  {
    id: "sleep_5",
    icon: "💤",
    titleKey: "sleep_5_title",
    descKey: "sleep_5_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_bedtime",
      count: 5,
    },
  },
  {
    id: "sleep_15",
    icon: "🛌",
    titleKey: "sleep_15_title",
    descKey: "sleep_15_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_bedtime",
      count: 15,
    },
  },
  {
    id: "sleep_30",
    icon: "🦉",
    titleKey: "sleep_30_title",
    descKey: "sleep_30_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_bedtime",
      count: 30,
    },
  },
  {
    id: "sleep_100",
    icon: "👑",
    titleKey: "sleep_100_title",
    descKey: "sleep_100_desc",
    requirement: {
      type: "preset_count",
      presetName: "preset_bedtime",
      count: 100,
    },
  },
];

/** Backward-compatibility alias — existing importers of SECRET_ACHIEVEMENTS continue to work. */
export const SECRET_ACHIEVEMENTS = SECRET_ACHIEVEMENTS_CATALOG;
