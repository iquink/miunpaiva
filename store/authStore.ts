import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, type User } from "../db/schema";

const SESSION_KEY = "session_user_id";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

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
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    try {
      const userId = await SecureStore.getItemAsync(SESSION_KEY);

      if (userId) {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, parseInt(userId, 10)))
          .limit(1);

        if (user) {
          set({ user, isAuthenticated: true, isLoading: false });
          return;
        }
      }

      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (username: string, password: string) => {
    try {
      // Hash the password
      const passwordHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password,
      );

      // Find user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (!user) {
        return { success: false, error: "Invalid username or password" };
      }

      if (user.passwordHash !== passwordHash) {
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
      // Validate input
      if (!username || username.length < 3) {
        return {
          success: false,
          error: "Username must be at least 3 characters",
        };
      }

      if (!password || password.length < 6) {
        return {
          success: false,
          error: "Password must be at least 6 characters",
        };
      }

      // Check if username exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (existingUser) {
        return { success: false, error: "Username already exists" };
      }

      // Hash the password
      const passwordHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password,
      );

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({ username, passwordHash })
        .returning();

      // Save session
      await SecureStore.setItemAsync(SESSION_KEY, newUser.id.toString());

      set({ user: newUser, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "An error occurred during registration" };
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
