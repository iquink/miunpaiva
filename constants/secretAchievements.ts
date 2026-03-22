export type TotalPresetCondition = {
  presetName: string;
  target: number;
};

export type ComboSameDayCondition = {
  presetNames: string[];
};

export type SecretAchievement = {
  id: string;
  title: string;
  description: string;
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
    title: "Aquaman",
    description: "Stay hydrated! Logged water intake 100 times.",
    icon: "💧",
    type: "total_preset",
    condition: { presetName: "Nesteytys/veden juonti", target: 100 },
  },
  {
    id: "ironman",
    title: "Iron Man",
    description: "Hit the gym 50 times. You are a machine!",
    icon: "🏋️",
    type: "total_preset",
    condition: { presetName: "Kuntosali", target: 50 },
  },
  {
    id: "sauna_master",
    title: "Suomalainen Sielu",
    description: "Visited the Sauna 50 times. A true Finnish soul.",
    icon: "🧖",
    type: "total_preset",
    condition: { presetName: "Sauna", target: 50 },
  },
  {
    id: "bingo_champion",
    title: "Lottovoittaja",
    description: "Played Bingo 20 times! Feeling lucky?",
    icon: "🎱",
    type: "total_preset",
    condition: { presetName: "Bingo", target: 20 },
  },
  {
    id: "picasso",
    title: "Picasso",
    description: "Completed 30 Art (Taide) sessions. Masterpiece!",
    icon: "🎨",
    type: "total_preset",
    condition: { presetName: "Taide", target: 30 },
  },
  {
    id: "disco_king",
    title: "Tanssikuningas",
    description: "Danced at the Disco 10 times. John Travolta is proud.",
    icon: "🕺",
    type: "total_preset",
    condition: { presetName: "Disco", target: 10 },
  },
  {
    id: "forest_spirit",
    title: "Metsänhenki",
    description: "Enjoyed the outdoors (Ulkoilu) 100 times.",
    icon: "🌲",
    type: "total_preset",
    condition: { presetName: "Ulkoilu", target: 100 },
  },
  {
    id: "zen_master",
    title: "Zen Master",
    description: "Practiced relaxation (Rentoutus) 30 times.",
    icon: "🧘",
    type: "total_preset",
    condition: { presetName: "Rentoutus", target: 30 },
  },
  {
    id: "clean_smile",
    title: "Puhdas Hymy",
    description: "Brushed your teeth 100 times. Dentist approved!",
    icon: "🦷",
    type: "total_preset",
    condition: { presetName: "Hampaiden pesu", target: 100 },
  },
  {
    id: "marathoner",
    title: "Maratoonari",
    description: "Went for a run (Juoksu) 50 times.",
    icon: "🏃",
    type: "total_preset",
    condition: { presetName: "Juoksu", target: 50 },
  },
  {
    id: "health_first",
    title: "Terveys Edellä",
    description: "Took your medication exactly as prescribed 100 times.",
    icon: "💊",
    type: "total_preset",
    condition: { presetName: "Lääkkeiden otto", target: 100 },
  },

  // ==========================================
  // 🌪 combo_same_day
  // ==========================================
  {
    id: "perfect_morning",
    title: "Perfect Morning",
    description: "Made bed, brushed teeth, and ate breakfast in one day.",
    icon: "🌅",
    type: "combo_same_day",
    condition: {
      presetNames: ["Sängyn petaus", "Hampaiden pesu", "Aamupalan syönti"],
    },
  },
  {
    id: "good_night",
    title: "Hyvää Yötä",
    description: "Evening snack, brushed teeth, and went to bed properly.",
    icon: "🌙",
    type: "combo_same_day",
    condition: {
      presetNames: ["Iltapalan syönti", "Hampaiden pesu", "Nukkumaan meno"],
    },
  },
  {
    id: "perfect_diet",
    title: "Täydellinen Ravitsemus",
    description:
      "Ate breakfast, lunch, dinner, and evening snack in a single day.",
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
    title: "Kevätsiivous",
    description: "Cleaned room, organized stuff, and did laundry in one day.",
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
    title: "Spa Day",
    description: "Sauna, Shower, and Relaxation all in one day.",
    icon: "🧖‍♀️",
    type: "combo_same_day",
    condition: {
      presetNames: ["Sauna", "Suihku", "Rentoutus"],
    },
  },
  {
    id: "active_day",
    title: "Aktiivinen Päivä",
    description: "Went outdoors, exercised (Jumppa), and took a shower.",
    icon: "💪",
    type: "combo_same_day",
    condition: {
      presetNames: ["Ulkoilu", "Jumppa", "Suihku"],
    },
  },
];
