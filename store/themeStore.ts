import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_STORAGE_KEY = "app_theme";

export type ThemeName = "default" | "forest" | "ocean" | "coffee";

interface ThemeState {
  activeTheme: ThemeName;
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  setTheme: (theme: ThemeName) => Promise<void>;
}

/**
 * Theme Store
 *
 * IMPORTANT: This store ONLY manages custom themes (default, forest, ocean, coffee).
 * It does NOT manage light/dark mode - that is handled by React Native's native
 * useColorScheme() hook, which automatically responds to system preferences.
 *
 * The activeTheme works ALONGSIDE light/dark mode, not instead of it.
 * Each theme has both light and dark variants defined in global.css.
 */
export const useThemeStore = create<ThemeState>((set) => ({
  activeTheme: "default",
  isLoading: true,

  initialize: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

      if (savedTheme && isValidTheme(savedTheme)) {
        set({ activeTheme: savedTheme as ThemeName, isLoading: false });
      } else {
        set({ activeTheme: "default", isLoading: false });
      }
    } catch (error) {
      console.error("Failed to load theme:", error);
      set({ activeTheme: "default", isLoading: false });
    }
  },

  setTheme: async (theme: ThemeName) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      set({ activeTheme: theme });
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  },
}));

function isValidTheme(value: string): boolean {
  return ["default", "forest", "ocean", "coffee"].includes(value);
}
