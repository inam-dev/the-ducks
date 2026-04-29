import { mockUsers } from "../data/mockUsers";
import type { User } from "../types/auth";

const STORAGE_KEY = "councilpoint_user";

export async function loginWithDemoUser(userId: string): Promise<User | null> {
  const user = mockUsers.find((item) => item.id === userId) ?? null;

  if (user && typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  return user;
}

export async function loginWithCredentials(email: string, _password: string): Promise<User | null> {
  // Future backend endpoint: POST /auth/login
  const matchedUser =
    mockUsers.find((user) => email.toLowerCase().includes(user.name.split(" ")[0].toLowerCase())) ??
    mockUsers[2];

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(matchedUser));
  }

  return matchedUser;
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as User;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function logout(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
