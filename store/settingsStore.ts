import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_STORAGE_KEY = "app_settings_v1";

interface SettingsState {
  isToastsEnabled: boolean;
  isSoundEnabled: boolean;
  _hydrated: boolean;

  // Actions
  initialize: () => Promise<void>;
  toggleToasts: () => Promise<void>;
  toggleSound: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  isToastsEnabled: true,
  isSoundEnabled: true,
  _hydrated: false,

  initialize: async () => {
    if (get()._hydrated) return;
    try {
      const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        set({
          isToastsEnabled: parsed.isToastsEnabled ?? true,
          isSoundEnabled: parsed.isSoundEnabled ?? true,
          _hydrated: true,
        });
      } else {
        set({ _hydrated: true });
      }
    } catch {
      set({ _hydrated: true });
    }
  },

  toggleToasts: async () => {
    const next = !get().isToastsEnabled;
    set({ isToastsEnabled: next });
    await _persist(get());
  },

  toggleSound: async () => {
    const next = !get().isSoundEnabled;
    set({ isSoundEnabled: next });
    await _persist(get());
  },
}));

async function _persist(state: SettingsState) {
  try {
    await AsyncStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        isToastsEnabled: state.isToastsEnabled,
        isSoundEnabled: state.isSoundEnabled,
      }),
    );
  } catch {
    // Non-critical
  }
}
