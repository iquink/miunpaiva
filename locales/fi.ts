// i18next namespace: login
export const login = {
  title: "Tervetuloa takaisin",
  subtitle: "Kirjaudu jatkaaksesi seurantaa",
  username_label: "Käyttäjänimi",
  username_placeholder: "Syötä käyttäjänimesi",
  password_label: "Salasana",
  password_placeholder: "Syötä salasanasi",
  button: "Kirjaudu sisään",
  loading: "Kirjaudutaan...",
  no_account: "Eikö sinulla ole tiliä?",
  sign_up: "Rekisteröidy",
  error_fill_fields: "Täytä kaikki kentät",
  error_failed: "Kirjautuminen epäonnistui",
  error_default: "Tapahtui virhe",
};

// i18next namespace: register
export const register = {
  title: "Luo tili",
  subtitle: "Aloita tapojen seuranta",
  username_label: "Käyttäjänimi",
  username_placeholder: "Valitse käyttäjänimi",
  password_label: "Salasana",
  password_placeholder: "Luo salasana (väh. 6 merkkiä)",
  confirm_password_label: "Vahvista salasana",
  confirm_password_placeholder: "Vahvista salasanasi",
  button: "Rekisteröidy",
  button_personal: "Aloita",
  loading: "Luodaan tiliä...",
  have_account: "Onko sinulla jo tili?",
  sign_in: "Kirjaudu sisään",
  back: "Takaisin",
  choose_title: "Tervetuloa!",
  choose_subtitle: "Miten käytät tätä laitetta?",
  personal_device_mode: "Henkilökohtainen laite",
  personal_device_subtitle: "Vain sinulle – ei salasanaa tarvita",
  shared_device_mode: "Jaettu laite",
  shared_device_subtitle: "Useita käyttäjiä – turvallinen kirjautuminen",
  error_fill_fields: "Täytä kaikki kentät",
  error_username_only: "Syötä käyttäjänimi",
  error_password_match: "Salasanat eivät täsmää",
  error_failed: "Rekisteröinti epäonnistui",
  error_default: "Tapahtui virhe",
};

// i18next default namespace (translation)
const translation = {
  // Tab names
  dashboard: "Kojelauta",
  achievements: "Saavutukset",
  settings: "Asetukset",

  // Dashboard
  dashboard_subtitle: "Seuraa päivittäisiä toimintoja",
  today: "Tänään",
  no_habits: "Ei vielä toimintoja. Lisää ensimmäinen!",
  add_habit: "Lisää toiminta",
  new_habit: "Uusi toiminta",
  habit_title: "Toiminnan nimi",
  habit_description: "Kuvaus (valinnainen)",
  habit_type: "Tyyppi",
  habit_type_boolean: "Kyllä/Ei",
  habit_type_counter: "Laskuri",
  habit_unit: "Yksikkö (esim. km, toistot)",
  habit_daily_goal: "Päivittäinen tavoite",
  habit_type_hint:
    "Täytä yksikkö/tavoite laskurille, jätä tyhjäksi yksinkertaiselle kyllä/ei",
  cancel: "Peruuta",
  add: "Lisää",
  create: "Luo",
  delete: "Poista",

  // Presets
  select_category: "Valitse kategoria",
  select_preset: "Valitse valmis",
  or_custom: "Tai luo oma toiminta:",
  // Habit creation tabs
  tab_choose_preset: "Valitse valmis",
  tab_custom_task: "Oma toiminta",
  // Time of day
  time_of_day: "Vuorokaudenaika",
  time_of_day_morning: "Aamu",
  time_of_day_late_morning: "Aamupäivä",
  time_of_day_afternoon: "Iltapäivä",
  time_of_day_evening: "Ilta",
  time_of_day_all_day: "Koko päivä",
  // Time zone section headers (dashboard grouping)
  time_zones: {
    morning: "☀️ Aamu",
    late_morning: "🌤️ Aamupäivä",
    afternoon: "🌞 Iltapäivä",
    evening: "🌙 Ilta",
    all_day: "🕐 Koko päivä",
  },
  // Preset categories
  cat_group_activities: "Ryhmätoiminta",
  cat_exercise: "Liikunta",
  cat_daily_routines: "Päivärutiinit",
  cat_daily_rhythm: "Vuorokausirytmi",
  cat_nutrition: "Ravitsemus",
  cat_cleaning: "Siivous",
  cat_responsibilities: "Vastuutehtävä",
  // Preset items — Group Activities
  preset_crafts: "Askartelu",
  preset_woodwork: "Puutyöt",
  preset_outdoor_activity: "Ulkoilu",
  preset_walk: "Lenkki",
  preset_singing: "Laulu",
  preset_congregation: "Seurakunta",
  preset_music: "Musiikki",
  preset_bingo: "Bingo",
  preset_art: "Taide",
  preset_games: "Peli",
  preset_relaxation: "Rentoutus",
  preset_disco: "Disco",
  preset_free_text: "Vapaamuotoinen teksti",
  // Preset items — Exercise
  preset_walking: "Kävely",
  preset_gymnastics: "Jumppa",
  preset_gym: "Kuntosali",
  preset_running: "Juoksu",
  // Preset items — Daily Routines
  preset_make_bed: "Sängyn petaus",
  preset_teeth_brush: "Hampaiden pesu",
  preset_shower: "Suihku",
  preset_sauna: "Sauna",
  preset_medication: "Lääkkeiden otto",
  preset_shaving: "Parran ajo",
  preset_laundry: "Pyykinpesu",
  // Preset items — Daily Rhythm
  preset_bedtime: "Nukkumaan meno",
  preset_wake_up: "Herätys",
  preset_rest: "Lepo",
  // Preset items — Nutrition
  preset_breakfast: "Aamupalan syönti",
  preset_lunch: "Lounaan syönti",
  preset_dinner: "Päivällisen syönti",
  preset_evening_snack: "Iltapalan syönti",
  preset_treats: "Herkuttelu",
  preset_hydration: "Nesteytys / veden juonti",
  // Preset items — Cleaning
  preset_room_cleaning: "Oman huoneen siivous",
  preset_organizing: "Tavaroiden järjestely",
  // Preset items — Responsibilities
  preset_kitchen_duty: "Keittiö",
  preset_cleaning_duty: "Siivous",
  // Schedule/Frequency
  schedule: "Aikataulu",
  frequency: "Toistuminen",
  daily: "Päivittäin",
  weekly: "Viikoittain",
  once: "Kertaluonteinen",
  end_date: "Päättymispäivä",
  end_date_optional: "Päättymispäivä (Valinnainen)",
  target_date: "Tavoitepäivä",
  repeat_days: "Toistopäivät",
  select_weekdays: "Valitse viikonpäivät",
  forever: "Ikuisesti",

  // Weekdays (short)
  weekday_sun: "Su",
  weekday_mon: "Ma",
  weekday_tue: "Ti",
  weekday_wed: "Ke",
  weekday_thu: "To",
  weekday_fri: "Pe",
  weekday_sat: "La",
  // Achievements
  achievements_subtitle: "Seuraa virstanpylväitäsi",
  no_achievements: "Ei vielä saavutuksia. Luo ensimmäinen!",
  unlocked: "Avattu",
  locked: "Lukittu",
  no_unlocked: "Ei vielä avattuja saavutuksia",
  all_unlocked: "Kaikki saavutukset avattu!",
  missed: "Ei enää saatavilla",
  no_missed: "Ei menetettyjä saavutuksia",
  new_achievement: "Uusi saavutus",
  achievement_title: "Saavutuksen nimi",
  achievement_description: "Kuvaus (valinnainen)",
  icon: "Kuvake",
  criteria_all_must_meet: "Kriteerit (Kaikkien täytyttävä)",
  criterion_num: "Kriteeri {{num}}",
  habit: "Toiminta",
  select_habit: "Valitse toiminta",
  rule_type: "Sääntötyyppi",
  streak: "Putki",
  total_count: "Kokonaismäärä",
  sum_value: "Summaarvo",
  target_value: "Tavoitearvo",
  target_value_placeholder: "esim. 7",
  days_period: "Päiväjakso",
  days_period_placeholder: "Päivät (Tyhjä = Koko aika)",
  add_criterion: "Lisää kriteeri",
  criteria_count: "{{count}} kriteeriä",
  criteria_count_to_complete: "{{count}} kriteeriä täytettävänä",
  no_habits_available: "Ei toimintoja saatavilla",
  close: "Sulje",
  days: "päivää",
  unknown_habit: "Tuntematon toiminta",

  // RPG System
  tab_my_goals: "Omat tavoitteet",
  tab_rpg_ranks: "RPG-rankit",
  rpg_subtitle: "Nouse tasolla suorittamalla tehtäviä",
  no_rpg_stats:
    "Ei vielä tilastoja. Aloita tehtävien suorittaminen noustaaksesi tasolla!",
  rpg_completed_tasks: "suoritetut tehtävät",
  rpg_rank: "Ranki",
  rpg_level: "Taso",
  rpg_progress_to_next: "Edistyminen seuraavalle tasolle",
  loading: "Ladataan...",

  // Settings
  settings_subtitle: "Hallinnoi tiliäsi",
  manage_account: "Hallinnoi tiliäsi",
  account: "Tili",
  account_info: "Tilin tiedot",
  username: "Käyttäjänimi",
  user_id: "Käyttäjätunnus",
  created_at: "Jäsen alkaen",
  member_since: "Jäsen alkaen",
  language: "Kieli",
  language_subtitle: "Valitse haluamasi kieli",
  // Color theme selector
  color_theme: "Väriteema",
  theme_default: "Oletus",
  theme_forest: "Metsä",
  theme_ocean: "Meri",
  theme_coffee: "Kahvi",
  actions: "Toiminnot",
  logout: "Kirjaudu ulos",
  logout_confirm: "Haluatko varmasti kirjautua ulos?",
  delete_account: "Poista tili",
  delete_account_confirm: "Poista tili?",
  delete_account_message:
    "Tämä poistaa tilisi ja kaikki tiedot pysyvästi. Tätä ei voi perua.",
  delete_account_warning:
    "Tämä poistaa tilisi ja kaikki siihen liittyvät tiedot pysyvästi. Tätä toimintoa ei voi perua.",
  delete_account_description: "Poista tilisi ja kaikki tiedot pysyvästi",
  danger_zone: "Vaaravyöhyke",
  deleting: "Poistetaan...",
  account_deleted: "Tili poistettu onnistuneesti",
  error_delete_account: "Tilin poistaminen epäonnistui",
  no_user: "Ei kirjautunutta käyttäjää",
  app_version: "Miunpäivä v1.0.0",
  made_with_love: "Tehty ❤️:lla React Nativella & Expolla",
  // Developer Mode
  enable_dev_mode_title: "Ota kehittäjätila käyttöön?",
  enable_dev_mode_message: "Tämä avaa DevTools-välilehden.",
  danger_title: "⚠️ VAARA",
  danger_message:
    "Kehittäjätila mahdollistaa tuhoavat toiminnot kuten tietokannan tyhjennyksen. Voit menettää kaikki tiedot. Oletko aivan varma?",
  enable: "Ota käyttöön",
  dev_mode_enabled_title: "Kehittäjätila käytössä",
  dev_mode_enabled_message: "DevTools-välilehti on nyt näkyvissä.",
  yes: "Kyllä",
  no: "Ei",

  // Errors
  error: "Virhe",
  success: "Onnistui",
  error_title_required: "Anna toiminnan nimi",
  error_achievement_title_required: "Anna saavutuksen nimi",
  error_select_habit: "Valitse toiminta kriteerille {{num}}",
  error_target_value: "Anna kelvollinen tavoitearvo kriteerille {{num}}",
  error_load_habits: "Toimintojen lataaminen epäonnistui",
  error_load_achievements: "Saavutusten lataaminen epäonnistui",
  error_create_habit: "Toiminnan luominen epäonnistui",
  error_create_achievement: "Saavutuksen luominen epäonnistui",
  error_delete_achievement: "Saavutuksen poistaminen epäonnistui",
  error_update_habit: "Toiminnan päivittäminen epäonnistui",
  success_achievement_created: "Saavutus luotu!",
  success_habit_created: "Toiminta luotu!",

  // Alerts
  delete_achievement_title: "Poista saavutus",
  delete_achievement_message: "Haluatko varmasti poistaa tämän saavutuksen?",
  delete_habit_message: "Haluatko varmasti poistaa tämän toiminnan?",
  logout_message: "Haluatko varmasti kirjautua ulos?",

  // Notifications
  notif_enable_reminder: "Ota muistutus käyttöön",
  notif_turn_on: "Ota muistutukset käyttöön",
  notif_turn_off: "Poista muistutukset käytöstä",
  error_notification_permission:
    "Ota ilmoitukset käyttöön laitteen asetuksista",

  // Auth
  login: "Kirjaudu",
  register: "Rekisteröidy",
  password: "Salasana",
  login_button: "Kirjaudu",
  register_button: "Rekisteröidy",
  no_account: "Eikö sinulla ole tiliä?",
  have_account: "Onko sinulla jo tili?",
  error_fill_fields: "Täytä kaikki kentät",
  error_login: "Virheellinen käyttäjänimi tai salasana",
  error_register: "Tilin luominen epäonnistui",
  error_username_taken: "Käyttäjänimi on jo käytössä",

  // Languages
  lang_en: "English",
  lang_fi: "Suomi",
  // Relaxations
  relax: "Rentoudu",
  relax_subtitle:
    "Valitse äänimaailma. Musiikki soi myös näytön ollessa pois päältä.",
  relax_track_1_title: "Kesämetsä",
  relax_track_1_description: "Lintujen laulu ja lehtien havina",
  relax_track_1_artist: "Miunpäivä",
  relax_track_2_title: "Syvä avaruus",
  relax_track_2_description: "Pehmeä binauraalinen humina",
  relax_track_2_artist: "Miunpäivä",

  // Activity Feed
  tab_goals: "Omat tavoitteet",
  tab_rewards: "Palkinnot",
  filter_rpg: "Tasot",
  filter_secrets: "Salaiset merkit",
  no_rewards:
    "Ei vielä palkintoja. Suorita tehtäviä ansaitaksesi RPG-tasoja ja avataksesi salaisia merkkejä!",

  // RPG Ranks
  rpg_ranks: {
    novice: "Noviisi",
    apprentice: "Oppipoika",
    adept: "Taitaja",
    master: "Mestari",
    grandmaster: "Suurmestari",
    expert: "Asiantuntija",
    hero: "Sankari",
    legend: "Legenda",
  },

  // Secret Achievements
  secret_achievements: {
    aquaman: {
      title: "Aquaman",
      description: "Pysy nestytettynä! Kirjasit veden juonnin 100 kertaa.",
    },
    ironman: {
      title: "Iron Man",
      description: "Kuntosalilla 50 kertaa. Olet kone!",
    },
    sauna_master: {
      title: "Suomalainen Sielu",
      description: "Kävi saunassa 50 kertaa. Aito suomalainen sielu.",
    },
    bingo_champion: {
      title: "Lottovoittaja",
      description: "Pelasi bingoa 20 kertaa! Tuuri suosii?",
    },
    picasso: {
      title: "Picasso",
      description: "Suoritti 30 taidetehtävää. Mestariteos!",
    },
    disco_king: {
      title: "Tanssikuningas",
      description: "Tanssi discossa 10 kertaa. John Travolta on ylpeä.",
    },
    forest_spirit: {
      title: "Metsänhenki",
      description: "Nautti ulkoilusta 100 kertaa.",
    },
    zen_master: {
      title: "Zen-mestari",
      description: "Harjoitti rentoutumista 30 kertaa.",
    },
    clean_smile: {
      title: "Puhdas Hymy",
      description: "Harjasi hampaansa 100 kertaa. Hammaslääkäri hyväksyy!",
    },
    marathoner: {
      title: "Maratoonari",
      description: "Lähti juoksemaan 50 kertaa.",
    },
    health_first: {
      title: "Terveys Edellä",
      description: "Otti lääkkeet täsmällisesti 100 kertaa.",
    },
    perfect_morning: {
      title: "Täydellinen Aamu",
      description:
        "Petasi sängyn, harjasi hampaat ja söi aamupalan yhtenä päivänä.",
    },
    good_night: {
      title: "Hyvää Yötä",
      description:
        "Iltapala, hampaiden harjaus ja nukkumaanmeno asianmukaisesti.",
    },
    perfect_diet: {
      title: "Täydellinen Ravitsemus",
      description:
        "Söi aamupalan, lounaan, päivällisen ja iltapalan yhtenä päivänä.",
    },
    spring_cleaning: {
      title: "Kevätsiivous",
      description:
        "Siivosi huoneen, järjesteli tavarat ja pesi pyykit yhtenä päivänä.",
    },
    spa_day: {
      title: "Kylpyläpäivä",
      description: "Sauna, suihku ja rentoutuminen kaikki yhtenä päivänä.",
    },
    active_day: {
      title: "Aktiivinen Päivä",
      description: "Ulkoilu, jumppa ja suihku yhtenä päivänä.",
    },

    // ---- Tiered: Walking ----
    walker_1: {
      title: "Ensimmäinen askel",
      description: "Hieno alku! Suoritit ensimmäisen kävelysi.",
    },
    walker_5: {
      title: "Tutkimusmatkailija",
      description: "5 kävelyä suoritettu. Opit tuntemaan naapuruston.",
    },
    walker_15: {
      title: "Reitin löytäjä",
      description: "15 kävelyä. Tiedät jokaisen polun ulkoa.",
    },
    walker_30: {
      title: "Puiston mestari",
      description: "30 kävelyä. Puut tervehtivät sinua ensin.",
    },
    walker_100: {
      title: "Maailmanvaeltaja",
      description: "100 kävelyä! Kiersit päiväntasaajan?",
    },

    // ---- Tiered: Hydration ----
    water_1: {
      title: "Ensimmäinen siemaisu",
      description: "Nestytysmatka on alkanut.",
    },
    water_5: {
      title: "Pysy nestytettynä",
      description: "5 päivää hyvää nestytystä. Kehosi kiittää.",
    },
    water_15: {
      title: "Kirkas virta",
      description: "15 päivää. Energiasi virtaa.",
    },
    water_30: {
      title: "Keidas",
      description: "30 päivää täydellinen vesitasapaino.",
    },
    water_100: {
      title: "Meren mestari",
      description: "100 päivää! Aquaman ottaa muistiinpanoja.",
    },

    // ---- Tiered: Medication ----
    meds_1: {
      title: "Aikataulussa",
      description: "Ensimmäinen lääke otettu ajoissa.",
    },
    meds_5: {
      title: "Rutiinin rakentaja",
      description: "5 kertaa aikataulussa. Jatka samaan tapaan!",
    },
    meds_15: {
      title: "Terveyden vartija",
      description: "15 kertaa. Terveysrutiinisi on vakaa.",
    },
    meds_30: {
      title: "Rautainen kuri",
      description: "30 kertaa. Kellon tarkkuudella.",
    },
    meds_100: {
      title: "Murtumaton",
      description: "100 kertaa! Täydellinen terveydenhoidon kuri.",
    },

    // ---- Tiered: Room Cleaning ----
    clean_1: {
      title: "Siisti alku",
      description: "Huone siivottu ensimmäistä kertaa.",
    },
    clean_5: {
      title: "Siisti ja puhdas",
      description: "5 siivousta. Tilasi näyttää hienolta.",
    },
    clean_15: {
      title: "Täpläpuhdas",
      description: "15 siivousta. Ei pölyä eikä likaa missään.",
    },
    clean_30: {
      title: "Järjestelijä",
      description: "30 siivousta. Kaikki täydellisellä paikallaan.",
    },
    clean_100: {
      title: "Marie Kondo",
      description: "100 siivousta! Tämä tuottaa iloa.",
    },

    // ---- Tiered: Bedtime ----
    sleep_1: {
      title: "Hyvää yötä",
      description: "Ensimmäinen nukkumaanmenorituaali suoritettu.",
    },
    sleep_5: {
      title: "Suloiset unet",
      description: "5 yötä tervettä nukkumaanmenorituaalia.",
    },
    sleep_15: {
      title: "Levännyt",
      description: "15 yötä. Vuorokausirytmisi korjaantuu.",
    },
    sleep_30: {
      title: "Unimestari",
      description: "30 yötä. Täydellinen unihygienia.",
    },
    sleep_100: {
      title: "Prinsessa Ruusunen",
      description: "100 yötä! Herää virkistyneenä joka päivä.",
    },
  },

  // Hub (Dashboard)
  hub: "Kotinäkymä",
  hub_subtitle: "Päivän yhteenveto",
  hub_todays_progress: "Tänään tehty",
  hub_completed_count: "{{current}} / {{total}} suoritettu",
  hub_new_badges: "{{count}} uutta merkkiä!",
  hub_relaxing_ambient: "Rentouttava ambient",
};

export default translation;
