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
  queue: ToastMessage[];

  // Actions
  showToast: (msg: Omit<ToastMessage, "id">) => void;
  hideToast: () => void;
  _processQueue: () => void;
}

let _hideTimer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set, get) => ({
  currentToast: null,
  queue: [],

  showToast: (msg) => {
    if (!useSettingsStore.getState().isToastsEnabled) return;

    const toast: ToastMessage = {
      ...msg,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };

    set((state) => ({ queue: [...state.queue, toast] }));
    get()._processQueue();
  },

  hideToast: () => {
    if (_hideTimer) {
      clearTimeout(_hideTimer);
      _hideTimer = null;
    }
    set((state) => {
      const [, ...remaining] = state.queue;
      return { currentToast: null, queue: remaining };
    });
    // Allow animation to finish before showing next
    setTimeout(() => get()._processQueue(), 400);
  },

  _processQueue: () => {
    const { currentToast, queue } = get();
    if (currentToast || queue.length === 0) return;

    const [next, ...remaining] = queue;
    set({ currentToast: next, queue: remaining });

    _hideTimer = setTimeout(() => {
      get().hideToast();
    }, 3500);
  },
}));
