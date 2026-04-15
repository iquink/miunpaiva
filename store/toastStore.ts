import { create } from "zustand";
import { useSettingsStore } from "./settingsStore";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  tab?: "levels" | "badges" | "goals";
}

interface ToastState {
  currentToast: ToastMessage | null;
  isVisible: boolean;
  queue: ToastMessage[];

  // Actions
  showToast: (msg: Omit<ToastMessage, "id">) => void;
  hideToast: () => void;
  processNext: () => void;
}

let _autoDismissTimer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set, get) => ({
  currentToast: null,
  isVisible: false,
  queue: [],

  showToast: (msg) => {
    if (!useSettingsStore.getState().isToastsEnabled) return;

    const toast: ToastMessage = {
      ...msg,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };

    set((state) => ({ queue: [...state.queue, toast] }));
    get().processNext();
  },

  processNext: () => {
    if (get().isVisible) return;
    if (get().queue.length === 0) return;

    const nextToast = get().queue[0];
    set((state) => ({
      isVisible: true,
      currentToast: nextToast,
      queue: state.queue.slice(1),
    }));

    if (_autoDismissTimer) clearTimeout(_autoDismissTimer);
    _autoDismissTimer = setTimeout(() => {
      get().hideToast();
    }, 3500);
  },

  hideToast: () => {
    if (_autoDismissTimer) {
      clearTimeout(_autoDismissTimer);
      _autoDismissTimer = null;
    }
    set({ isVisible: false });
    // Wait for exit animation before clearing toast content and advancing queue
    setTimeout(() => {
      set({ currentToast: null });
      get().processNext();
    }, 300);
  },
}));
