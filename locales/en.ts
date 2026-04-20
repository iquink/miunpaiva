// i18next namespace: login
export const login = {
  title: "Welcome Back",
  subtitle: "Sign in to continue tracking",
  username_label: "Username",
  username_placeholder: "Enter your username",
  password_label: "Password",
  password_placeholder: "Enter your password",
  button: "Sign In",
  loading: "Signing In...",
  no_account: "Don't have an account?",
  sign_up: "Sign Up",
  error_fill_fields: "Please fill in all fields",
  error_failed: "Login Failed",
  error_default: "An error occurred",
};

// i18next namespace: register
export const register = {
  title: "Create Account",
  subtitle: "Start your habit tracking journey",
  username_label: "Username",
  username_placeholder: "Choose a username",
  password_label: "Password",
  password_placeholder: "Create a password (min 6 characters)",
  confirm_password_label: "Confirm Password",
  confirm_password_placeholder: "Confirm your password",
  button: "Sign Up",
  button_personal: "Get Started",
  loading: "Creating Account...",
  have_account: "Already have an account?",
  sign_in: "Sign In",
  back: "Back",
  choose_title: "Welcome!",
  choose_subtitle: "How will you use this device?",
  personal_device_mode: "Personal Device",
  personal_device_subtitle: "Just for you – no password needed",
  shared_device_mode: "Shared Device",
  shared_device_subtitle: "Multiple users – secure login",
  error_fill_fields: "Please fill in all fields",
  error_username_only: "Please enter a username",
  error_password_match: "Passwords do not match",
  error_failed: "Registration Failed",
  error_default: "An error occurred",
};

// i18next namespace: common
// Only truly shared keys: navigation labels, shared UI, global errors, language helpers
export const common = {
  // Tab navigation labels (used in _layout.tsx)
  dashboard: "Dashboard",
  tasks: "Tasks",
  tab_rewards: "Achievements",
  settings: "Settings",
  relax: "Relax",
  achievements: "Achievements",

  // Shared UI actions
  cancel: "Cancel",
  delete: "Delete",
  yes: "Yes",
  no: "No",
  add: "Add",
  create: "Create",
  close: "Close",
  loading: "Loading...",

  // Global error / success
  error: "Error",
  success: "Success",
  error_title_required: "Please enter a task title",
  error_achievement_title_required: "Please enter an achievement title",
  error_select_habit: "Please select a task for criterion {{num}}",
  error_target_value: "Please enter a valid target value for criterion {{num}}",
  error_load_habits: "Failed to load tasks",
  error_load_achievements: "Failed to load achievements",
  error_create_habit: "Failed to create task",
  error_create_achievement: "Failed to create achievement",
  error_delete_achievement: "Failed to delete achievement",
  error_update_habit: "Failed to update task",
  success_achievement_created: "Achievement created!",
  success_habit_created: "Task created!",

  // Toast notifications (used by global toast handler)
  toast_level_up: "Level Up!",
  toast_badge_unlocked: "New Badge!",
  toast_goal_reached: "Goal Achieved!",

  // Languages
  lang_en: "English",
  lang_fi: "Suomi",

  // Auth helpers (legacy — also in login/register namespaces)
  login: "Login",
  register: "Register",
  password: "Password",
  login_button: "Login",
  register_button: "Register",
  no_account: "Don't have an account?",
  have_account: "Already have an account?",
  error_fill_fields: "Please fill in all fields",
  error_login: "Invalid username or password",
  error_register: "Failed to create account",
  error_username_taken: "Username already taken",

  // Misc shared
  days: "days",
  unknown_habit: "Unknown habit",
  no_habits_available: "No tasks available",
  habit: "Task",

  // App meta
  app_version: "Miunpäivä v1.0.0",
  made_with_love: "Made with ❤️ using React Native & Expo",
};

// i18next namespace: hub
// Keys for the Hub/index dashboard screen and its widgets
export const hub = {
  hub: "Hub",
  hub_subtitle: "Your daily overview",
  dashboard_subtitle: "Track your daily tasks",
  today: "Today",
  hub_todays_progress: "Today's Progress",
  hub_completed_count: "{{current}} / {{total}} completed",
  hub_no_tasks_today: "No tasks scheduled for today.",
  hub_all_tasks_done: "All tasks done — great work!",
  hub_new_badges: "{{count}} New Badges!",
  hub_badges_all_viewed: "All caught up!",
  hub_badges_empty_state: "Complete habits to unlock badges!",
  hub_personal_goals: "Personal Goals",
  hub_no_rpg_stats: "Complete habits to see your progress!",
  hub_relaxing_ambient: "Relaxing Ambient",
  hub_no_track_selected: "Nothing playing. Tap to select.",
  hub_secret_badges: "Badges",
  hub_rpg_levels: "My progress",
  hub_relaxation: "Relaxation",
  hub_empty_goals: "No goals yet. Create your first one!",
  hub_all_goals_done: "All goals achieved — amazing!",
  hub_goals_completed_count: "{{current}} / {{total}} goals achieved",
  level_short: "Lv",
  hub_active_sounds: "{{count}} active sound(s)",
};

// i18next namespace: tasks
// Keys for habit creation, editing, and the daily task list
export const tasks = {
  tasks_subtitle: "Track your daily tasks",
  new_habit: "New Task",
  no_habits: "No tasks yet. Add your first one!",
  add_habit: "Add Task",

  // Habit form fields
  habit_title: "Task title",
  habit_description: "Description (optional)",
  habit_type: "Type",
  habit_type_boolean: "Yes/No",
  habit_type_counter: "Counter",
  habit_unit: "Unit (e.g., km, reps)",
  habit_daily_goal: "Daily Goal",
  habit_type_hint: "Fill unit/goal for counter, leave empty for simple yes/no",

  // Preset selector
  select_category: "Select Category",
  select_preset: "Select Preset",
  or_custom: "Or create custom task:",
  tab_choose_preset: "Choose Preset",
  tab_custom_task: "Custom Task",

  // Time of day
  time_of_day: "Time of Day",
  time_of_day_morning: "Morning",
  time_of_day_late_morning: "Late Morning",
  time_of_day_afternoon: "Afternoon",
  time_of_day_evening: "Evening",
  time_of_day_all_day: "All Day",
  time_zones: {
    morning: "☀️ Morning",
    late_morning: "🌤️ Late Morning",
    afternoon: "🌞 Afternoon",
    evening: "🌙 Evening",
    all_day: "🕐 All Day",
  },

  // Preset categories
  cat_group_activities: "Group Activities",
  cat_exercise: "Exercise",
  cat_daily_routines: "Daily Routines",
  cat_daily_rhythm: "Daily Rhythm",
  cat_nutrition: "Nutrition",
  cat_cleaning: "Cleaning",
  cat_responsibilities: "Responsibilities",

  // Preset items — Group Activities
  preset_crafts: "Crafts",
  preset_woodwork: "Woodwork",
  preset_outdoor_activity: "Outdoor Activity",
  preset_walk: "Walk",
  preset_singing: "Singing",
  preset_congregation: "Congregation",
  preset_music: "Music",
  preset_bingo: "Bingo",
  preset_art: "Art",
  preset_games: "Games",
  preset_relaxation: "Relaxation",
  preset_disco: "Disco",
  preset_free_text: "Free Text",

  // Preset items — Exercise
  preset_walking: "Walking",
  preset_gymnastics: "Gymnastics",
  preset_gym: "Gym",
  preset_running: "Running",

  // Preset items — Daily Routines
  preset_make_bed: "Make Bed",
  preset_teeth_brush: "Brush Teeth",
  preset_shower: "Shower",
  preset_sauna: "Sauna",
  preset_medication: "Take Medication",
  preset_shaving: "Shaving",
  preset_laundry: "Laundry",

  // Preset items — Daily Rhythm
  preset_bedtime: "Bedtime",
  preset_wake_up: "Wake Up",
  preset_rest: "Rest",

  // Preset items — Nutrition (corrected per native speaker feedback)
  preset_breakfast: "Breakfast",
  preset_lunch: "Lunch",
  preset_dinner: "Dinner",
  preset_evening_snack: "Evening Snack",
  preset_treats: "Treats",
  preset_hydration: "Drinking Water",

  // Preset items — Cleaning
  preset_room_cleaning: "Clean Room",
  preset_organizing: "Organize Belongings",

  // Preset items — Responsibilities
  preset_kitchen_duty: "Kitchen Duty",
  preset_cleaning_duty: "Cleaning Duty",

  // Schedule / Frequency
  schedule: "Schedule",
  frequency: "Frequency",
  daily: "Daily",
  weekly: "Weekly",
  once: "One-time",
  end_date: "End Date",
  end_date_optional: "End Date (Optional)",
  target_date: "Target Date",
  repeat_days: "Repeat Days",
  select_weekdays: "Select weekdays",
  forever: "Forever",

  // Weekdays (short)
  weekday_sun: "Sun",
  weekday_mon: "Mon",
  weekday_tue: "Tue",
  weekday_wed: "Wed",
  weekday_thu: "Thu",
  weekday_fri: "Fri",
  weekday_sat: "Sat",

  // Habit details modal
  habit_details: "Details",
  habit_done: "Mark as Done",
  habit_undo: "Undo",
  delete_habit_message: "Are you sure you want to delete this habit?",

  // Reminder notifications
  notif_enable_reminder: "Enable Reminder",
  notif_turn_on: "Turn On Reminders",
  notif_turn_off: "Turn Off Reminders",
  error_notification_permission:
    "Please enable notifications in your device settings",
  notification_reminder_title: "Reminder",
  notification_time_to_do: "Don't forget!",
};

// i18next namespace: rewards
// Keys for achievements, badges, RPG levels, and goal creation
export const rewards = {
  achievements_subtitle: "Track your milestones",
  no_achievements: "No achievements yet. Create your first one!",
  unlocked: "Unlocked",
  locked: "Locked",
  no_unlocked: "No unlocked achievements yet",
  all_unlocked: "All achievements unlocked!",
  missed: "Missed",
  no_missed: "No missed achievements",
  new_achievement: "New Achievement",
  achievement_title: "Achievement title",
  achievement_description: "Description (optional)",
  icon: "Icon",

  // Criteria builder
  criteria_all_must_meet: "Criteria (All must be met)",
  criterion_num: "Criterion {{num}}",
  select_habit: "Select a task",
  rule_type: "Rule Type",
  streak: "Streak",
  streak_subtitle: "Completed on consecutive days",
  total_count: "Completion Count",
  total_count_subtitle: "Number of times completed",
  sum_value: "Total Accumulated Value",
  sum_value_subtitle: "For counters, e.g., total amount of water",
  target_value: "Target Value",
  target_value_placeholder: "e.g., 7",
  days_period: "Days Period",
  days_period_placeholder: "Days (Empty = All time)",
  add_criterion: "Add Criterion",
  criteria_count: "{{count}} criteria",
  criteria_count_to_complete: "{{count}} criteria to complete",

  // RPG system
  tab_my_goals: "My Goals",
  tab_rpg_ranks: "Progress",
  rpg_subtitle: "Track your progress by completing tasks",
  no_rpg_stats: "No stats yet. Start completing tasks to gain levels!",
  rpg_completed_tasks: "completed tasks",
  rpg_rank: "Rank",
  rpg_level: "Level",
  rpg_progress_to_next: "Progress to next level",

  // Activity feed / sub-tabs
  tab_goals: "My Goals",
  filter_rpg: "Progress",
  filter_secrets: "Badges",
  no_rewards:
    "No achievements yet. Complete tasks to track your progress and unlock badges!",

  // Alerts
  delete_achievement_title: "Delete Achievement",
  delete_achievement_message:
    "Are you sure you want to delete this achievement?",

  // RPG rank titles
  rpg_ranks: {
    novice: "Novice",
    apprentice: "Apprentice",
    adept: "Adept",
    master: "Master",
    grandmaster: "Grandmaster",
    expert: "Expert",
    hero: "Hero",
    legend: "Legend",
  },

  // Secret achievement catalog
  secret_achievements: {
    aquaman: {
      title: "Aquaman",
      description: "Stay hydrated! Logged water intake 100 times.",
    },
    ironman: {
      title: "Iron Man",
      description: "Hit the gym 50 times. You are a machine!",
    },
    sauna_master: {
      title: "Suomalainen Sielu",
      description: "Visited the Sauna 50 times. A true Finnish soul.",
    },
    bingo_champion: {
      title: "Lottovoittaja",
      description: "Played Bingo 20 times! Feeling lucky?",
    },
    picasso: {
      title: "Picasso",
      description: "Completed 30 Art sessions. Masterpiece!",
    },
    disco_king: {
      title: "Tanssikuningas",
      description: "Danced at the Disco 10 times. John Travolta is proud.",
    },
    forest_spirit: {
      title: "Metsänhenki",
      description: "Enjoyed the outdoors 100 times.",
    },
    zen_master: {
      title: "Zen Master",
      description: "Practiced relaxation 30 times.",
    },
    clean_smile: {
      title: "Puhdas Hymy",
      description: "Brushed your teeth 100 times. Dentist approved!",
    },
    marathoner: {
      title: "Maratoonari",
      description: "Went for a run 50 times.",
    },
    health_first: {
      title: "Terveys Edellä",
      description: "Took your medication exactly as prescribed 100 times.",
    },
    perfect_morning: {
      title: "Perfect Morning",
      description: "Made bed, brushed teeth, and ate breakfast in one day.",
    },
    good_night: {
      title: "Hyvää Yötä",
      description: "Evening snack, brushed teeth, and went to bed properly.",
    },
    perfect_diet: {
      title: "Täydellinen Ravitsemus",
      description:
        "Ate breakfast, lunch, dinner, and evening snack in a single day.",
    },
    spring_cleaning: {
      title: "Kevätsiivous",
      description: "Cleaned room, organized stuff, and did laundry in one day.",
    },
    spa_day: {
      title: "Spa Day",
      description: "Sauna, Shower, and Relaxation all in one day.",
    },
    active_day: {
      title: "Aktiivinen Päivä",
      description: "Went outdoors, exercised, and took a shower.",
    },
    walker_1: {
      title: "First Step",
      description: "A great start! You completed your first walk.",
    },
    walker_5: {
      title: "Explorer",
      description:
        "5 walks completed. You're getting to know the neighborhood.",
    },
    walker_15: {
      title: "Pathfinder",
      description: "15 walks. You know every trail by heart.",
    },
    walker_30: {
      title: "Park Master",
      description: "30 walks. Trees greet you first.",
    },
    walker_100: {
      title: "Globe Trotter",
      description: "100 walks! Did you just walk around the equator?",
    },
    water_1: { title: "First Sip", description: "Hydration journey started." },
    water_5: {
      title: "Stay Hydrated",
      description: "5 days of good hydration. Your body thanks you.",
    },
    water_15: {
      title: "Clear Stream",
      description: "15 days. You're flowing with energy.",
    },
    water_30: {
      title: "Oasis",
      description: "30 days of perfect water balance.",
    },
    water_100: {
      title: "Ocean Master",
      description: "100 days! Aquaman is taking notes.",
    },
    meds_1: {
      title: "On Track",
      description: "First medication taken on time.",
    },
    meds_5: {
      title: "Routine Builder",
      description: "5 times on schedule. Keep it up!",
    },
    meds_15: {
      title: "Health Guardian",
      description: "15 times. Your health routine is solid.",
    },
    meds_30: {
      title: "Iron Discipline",
      description: "30 times. Clockwork precision.",
    },
    meds_100: {
      title: "Unbreakable",
      description: "100 times! Perfect health discipline.",
    },
    clean_1: {
      title: "Tidy Start",
      description: "Room cleaned for the first time.",
    },
    clean_5: {
      title: "Neat & Clean",
      description: "5 cleanings. Your space is looking great.",
    },
    clean_15: {
      title: "Spotless",
      description: "15 cleanings. Not a speck of dust in sight.",
    },
    clean_30: {
      title: "Organizer",
      description: "30 cleanings. Everything in its perfect place.",
    },
    clean_100: {
      title: "Marie Kondo",
      description: "100 cleanings! This sparks joy.",
    },
    sleep_1: {
      title: "Good Night",
      description: "First bedtime routine completed.",
    },
    sleep_5: {
      title: "Sweet Dreams",
      description: "5 nights of healthy sleep routine.",
    },
    sleep_15: {
      title: "Rested",
      description: "15 nights. Your circadian rhythm is healing.",
    },
    sleep_30: {
      title: "Sleep Champion",
      description: "30 nights. Perfect sleep hygiene.",
    },
    sleep_100: {
      title: "Sleeping Beauty",
      description: "100 nights! Waking up refreshed every single day.",
    },
  },
};

// i18next namespace: relax
// Keys for audio tracks, ambient mixer, and music player
export const relax = {
  relax_subtitle:
    "Choose a sound accompaniment. Music will play even when the screen is off.",
  relax_track_1_title: "Summer Forest",
  relax_track_1_description: "Birdsong and rustling leaves",
  relax_track_1_artist: "Miunpäivä",
  relax_track_2_title: "Deep Space",
  relax_track_2_description: "Soft binaural hum",
  relax_track_2_artist: "Miunpäivä",

  // Mode tab labels (corrected per native speaker feedback)
  tab_mixer: "Ambient Sounds",
  tab_music: "Music",

  // Mode description texts (new)
  tab_mixer_desc: "Mix multiple sounds together",
  tab_music_desc: "Listen to relaxing tracks",

  // Mixer controls
  mixer_play: "Play Mixer",
  mixer_pause: "Pause Mixer",

  // Mixer track names
  track_rain: "Rain",
  track_fire: "Fireplace",
  track_birds: "Birds",
  track_bg_morning: "Morning",
  track_bg_guitar: "Acoustic Guitar",
  track_bg_piano: "Piano",
  track_bg_piano2: "Piano II",

  // Music player track names
  track_guitar1: "Summer Forest",
  track_guitar2: "Deep Space",
};

// i18next namespace: settings
// Keys for user preferences, account management, danger zone, theme
export const settings = {
  settings_subtitle: "Manage your account",
  manage_account: "Manage your account",
  account: "Account",
  account_info: "Account Info",
  username: "Username",
  user_id: "User ID",
  created_at: "Member since",
  member_since: "Member since",
  language: "Language",
  language_subtitle: "Choose your preferred language",

  // Color theme selector
  color_theme: "Color Theme",
  theme_default: "Default",
  theme_forest: "Forest",
  theme_ocean: "Ocean",
  theme_coffee: "Coffee",

  // Account actions
  actions: "Actions",
  logout: "Logout",
  logout_confirm: "Are you sure you want to logout?",
  logout_message: "Are you sure you want to logout?",
  delete_account: "Delete Account",
  delete_account_confirm: "Delete Account?",
  delete_account_message:
    "This will permanently delete your account and all data. This cannot be undone.",
  delete_account_warning:
    "This will permanently delete your account and all associated data. This action cannot be undone.",
  delete_account_description: "Permanently delete your account and all data",

  // Danger zone (corrected per native speaker feedback)
  danger_zone: "Account Deletion",
  deleting: "Deleting...",
  account_deleted: "Account deleted successfully",
  error_delete_account: "Failed to delete account",
  no_user: "No user logged in",

  // Notifications & Feedback
  settings_feedback_section: "Notifications & Feedback",
  settings_toasts_title: "Pop-up notifications",
  settings_toasts_desc: "Show toasts for levels and achievements",
  settings_sound_title: "Sound effects",

  // Developer mode
  dev_test_toast: "Test Global Toast",
  enable_dev_mode_title: "Enable Developer Mode?",
  enable_dev_mode_message: "This unlocks the DevTools tab.",
  danger_title: "⚠️ DANGER",
  danger_message:
    "Developer mode allows destructive actions like wiping the database. You could lose all data. Are you absolutely sure?",
  enable: "Enable",
  dev_mode_enabled_title: "Developer Mode Enabled",
  dev_mode_enabled_message: "The DevTools tab is now visible.",
};

// Default export is the common namespace (backward-compatible alias)
export default common;
