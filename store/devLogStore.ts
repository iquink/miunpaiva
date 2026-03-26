import { create } from "zustand";

interface DevLogState {
  logs: string[];
  addLog: (message: string) => void;
  clearLogs: () => void;
}

export const useDevLogStore = create<DevLogState>((set) => ({
  logs: [],

  addLog: (message: string) => {
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
    set((state) => ({ logs: [`[${timestamp}] ${message}`, ...state.logs] }));
  },

  clearLogs: () => set({ logs: [] }),
}));
