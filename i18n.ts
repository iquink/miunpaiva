import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import commonEn, {
  login as loginEn,
  register as registerEn,
  hub as hubEn,
  tasks as tasksEn,
  rewards as rewardsEn,
  relax as relaxEn,
  settings as settingsEn,
} from "./locales/en";
import commonFi, {
  login as loginFi,
  register as registerFi,
  hub as hubFi,
  tasks as tasksFi,
  rewards as rewardsFi,
  relax as relaxFi,
  settings as settingsFi,
} from "./locales/fi";

const LANGUAGE_KEY = "user_language";

const resources = {
  en: {
    translation: commonEn, // backward-compat alias
    common: commonEn,
    hub: hubEn,
    tasks: tasksEn,
    rewards: rewardsEn,
    relax: relaxEn,
    settings: settingsEn,
    login: loginEn,
    register: registerEn,
  },
  fi: {
    translation: commonFi, // backward-compat alias
    common: commonFi,
    hub: hubFi,
    tasks: tasksFi,
    rewards: rewardsFi,
    relax: relaxFi,
    settings: settingsFi,
    login: loginFi,
    register: registerFi,
  },
};

// Get saved language or detect system language
const getInitialLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage) {
      return savedLanguage;
    }
    // Auto-detect system language
    const systemLanguage = Localization.getLocales()[0]?.languageCode;
    if (systemLanguage === "fi") {
      return "fi";
    }
    return "en"; // Default fallback
  } catch (error) {
    console.error("Error getting initial language:", error);
    return "en";
  }
};

// Initialize i18next
export const initI18n = async () => {
  const initialLanguage = await getInitialLanguage();

  i18n.use(initReactI18next).init({
    resources,
    lng: initialLanguage,
    fallbackLng: "en",
    defaultNS: "common",
    ns: [
      "common",
      "translation",
      "hub",
      "tasks",
      "rewards",
      "relax",
      "settings",
      "login",
      "register",
    ],
    interpolation: {
      escapeValue: false, // React already escapes
    },
    compatibilityJSON: "v3", // For proper interpolation
  });

  return i18n;
};

// Function to change language and persist
export const changeLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error("Error changing language:", error);
  }
};

export default i18n;
