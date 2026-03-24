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
  loading: "Luodaan tiliä...",
  have_account: "Onko sinulla jo tili?",
  sign_in: "Kirjaudu sisään",
  error_fill_fields: "Täytä kaikki kentät",
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
  logout_message: "Haluatko varmasti kirjautua ulos?",

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
  },
};

export default translation;
