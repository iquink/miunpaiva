import { eq } from "drizzle-orm";
import * as Crypto from "expo-crypto";
import { db } from "../db";
import { users, type User } from "../db/schema";

/**
 * Auth Service
 * Contains all database operations related to user authentication
 */

/**
 * Find a user by ID
 */
export async function getUserById(userId: number): Promise<User | null> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Failed to fetch user");
  }
}

/**
 * Find a user by username
 */
export async function getUserByUsername(
  username: string,
): Promise<User | null> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw new Error("Failed to fetch user");
  }
}

/**
 * Verify user credentials
 */
export async function verifyUserCredentials(
  username: string,
  password: string,
): Promise<User | null> {
  try {
    // Hash the password
    const passwordHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password,
    );

    // Find user
    const user = await getUserByUsername(username);

    if (!user) {
      return null;
    }

    if (user.passwordHash !== passwordHash) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error verifying credentials:", error);
    throw new Error("Failed to verify credentials");
  }
}

/**
 * Create a new user
 */
export async function createUser(
  username: string,
  password: string,
): Promise<User> {
  try {
    // Validate input
    if (!username || username.length < 3) {
      throw new Error("Username must be at least 3 characters");
    }

    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Check if username exists
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      throw new Error("Username already exists");
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

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

/**
 * Delete a user account
 */
export async function deleteUser(userId: number): Promise<void> {
  try {
    await db.delete(users).where(eq(users.id, userId));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}
