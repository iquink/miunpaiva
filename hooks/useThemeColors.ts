import { useColorScheme } from "react-native";
import { useThemeStore, type ThemeName } from "../store/themeStore";

/**
 * Theme Colors Interface
 *
 * All colors are returned as hex strings for easy consumption by React Native components.
 */
export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

/**
 * Color definitions for all theme variants
 *
 * Structure: THEME_COLORS[theme][mode] = colors
 * - theme: "default" | "forest" | "ocean" | "coffee"
 * - mode: "light" | "dark"
 */
const THEME_COLORS: Record<ThemeName, Record<"light" | "dark", ThemeColors>> = {
  default: {
    light: {
      background: "#f9fafb",
      surface: "#ffffff",
      primary: "#3b82f6",
      primaryForeground: "#ffffff",
      secondary: "#64748b",
      secondaryForeground: "#ffffff",
      accent: "#93c5fd",
      text: "#0f172a",
      textSecondary: "#64748b",
      border: "#e2e8f0",
      success: "#22c55e",
      warning: "#fb923c",
      error: "#ef4444",
    },
    dark: {
      background: "#0f172a",
      surface: "#1e293b",
      primary: "#60a5fa",
      primaryForeground: "#0f172a",
      secondary: "#94a3b8",
      secondaryForeground: "#0f172a",
      accent: "#3b82f6",
      text: "#f1f5f9",
      textSecondary: "#94a3b8",
      border: "#334155",
      success: "#22c55e",
      warning: "#fb923c",
      error: "#ef4444",
    },
  },
  forest: {
    light: {
      background: "#f0fdf4",
      surface: "#ffffff",
      primary: "#22c55e",
      primaryForeground: "#ffffff",
      secondary: "#4ade80",
      secondaryForeground: "#166534",
      accent: "#86efac",
      text: "#14532d",
      textSecondary: "#166534",
      border: "#bbf7d0",
      success: "#22c55e",
      warning: "#fb923c",
      error: "#ef4444",
    },
    dark: {
      background: "#064e3b",
      surface: "#14532d",
      primary: "#4ade80",
      primaryForeground: "#064e3b",
      secondary: "#22c55e",
      secondaryForeground: "#f0fdf4",
      accent: "#22c55e",
      text: "#f0fdf4",
      textSecondary: "#bbf7d0",
      border: "#166534",
      success: "#4ade80",
      warning: "#fb923c",
      error: "#ef4444",
    },
  },
  // Placeholder for future themes
  ocean: {
    light: {
      background: "#f0f9ff",
      surface: "#ffffff",
      primary: "#0ea5e9",
      primaryForeground: "#ffffff",
      secondary: "#38bdf8",
      secondaryForeground: "#075985",
      accent: "#7dd3fc",
      text: "#0c4a6e",
      textSecondary: "#075985",
      border: "#bae6fd",
      success: "#22c55e",
      warning: "#fb923c",
      error: "#ef4444",
    },
    dark: {
      background: "#075985",
      surface: "#0c4a6e",
      primary: "#38bdf8",
      primaryForeground: "#075985",
      secondary: "#0ea5e9",
      secondaryForeground: "#f0f9ff",
      accent: "#0ea5e9",
      text: "#f0f9ff",
      textSecondary: "#bae6fd",
      border: "#0c4a6e",
      success: "#22c55e",
      warning: "#fb923c",
      error: "#ef4444",
    },
  },
  coffee: {
    light: {
      background: "#fef3c7",
      surface: "#ffffff",
      primary: "#d97706",
      primaryForeground: "#ffffff",
      secondary: "#f59e0b",
      secondaryForeground: "#78350f",
      accent: "#fbbf24",
      text: "#78350f",
      textSecondary: "#92400e",
      border: "#fde68a",
      success: "#22c55e",
      warning: "#fb923c",
      error: "#ef4444",
    },
    dark: {
      background: "#78350f",
      surface: "#92400e",
      primary: "#fbbf24",
      primaryForeground: "#78350f",
      secondary: "#f59e0b",
      secondaryForeground: "#fef3c7",
      accent: "#f59e0b",
      text: "#fef3c7",
      textSecondary: "#fde68a",
      border: "#92400e",
      success: "#22c55e",
      warning: "#fb923c",
      error: "#ef4444",
    },
  },
};

/**
 * useThemeColors Hook
 *
 * Returns the current theme colors by combining:
 * 1. The active custom theme from the theme store (default, forest, ocean, coffee)
 * 2. The system color scheme from React Native (light, dark)
 *
 * This ensures that custom themes work harmoniously with native light/dark mode.
 *
 * @returns ThemeColors object with all current color values as hex strings
 */
export function useThemeColors(): ThemeColors {
  const colorScheme = useColorScheme();
  const activeTheme = useThemeStore((state) => state.activeTheme);

  // Fallback to light mode if colorScheme is null
  const mode = colorScheme === "dark" ? "dark" : "light";

  return THEME_COLORS[activeTheme][mode];
}
