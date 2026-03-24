import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import {
  getUserById,
  verifyUserCredentials,
  createUser,
  hasAnyUsers,
  createPersonalUser,
} from "../services/authService";
import type { User } from "../db/schema";

const SESSION_KEY = "session_user_id";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isFirstLaunch: boolean;

  // Actions
  initialize: () => Promise<void>;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  registerPersonal: (
    username: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isFirstLaunch: true,

  initialize: async () => {
    try {
      const anyUsers = await hasAnyUsers();
      const userId = await SecureStore.getItemAsync(SESSION_KEY);

      if (userId) {
        const user = await getUserById(parseInt(userId, 10));

        if (user) {
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isFirstLaunch: false,
          });
          return;
        }
      }

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isFirstLaunch: !anyUsers,
      });
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isFirstLaunch: true,
      });
    }
  },

  login: async (username: string, password: string) => {
    try {
      const user = await verifyUserCredentials(username, password);

      if (!user) {
        return { success: false, error: "Invalid username or password" };
      }

      // Save session
      await SecureStore.setItemAsync(SESSION_KEY, user.id.toString());

      set({ user, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An error occurred during login" };
    }
  },

  register: async (username: string, password: string) => {
    try {
      const newUser = await createUser(username, password);

      // Save session
      await SecureStore.setItemAsync(SESSION_KEY, newUser.id.toString());

      set({ user: newUser, isAuthenticated: true, isFirstLaunch: false });
      return { success: true };
    } catch (error: any) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.message || "An error occurred during registration",
      };
    }
  },

  registerPersonal: async (username: string) => {
    try {
      const newUser = await createPersonalUser(username);

      // Always persist session for personal accounts
      await SecureStore.setItemAsync(SESSION_KEY, newUser.id.toString());

      set({ user: newUser, isAuthenticated: true, isFirstLaunch: false });
      return { success: true };
    } catch (error: any) {
      console.error("Personal registration error:", error);
      return {
        success: false,
        error: error.message || "An error occurred during registration",
      };
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync(SESSION_KEY);
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
}));
