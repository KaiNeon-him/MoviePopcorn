import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: number;
}

interface SessionUser extends User {
  expiresAt: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'moviepopcorn_users';
const CURRENT_USER_KEY = 'moviepopcorn_current_user';

const SESSION_LONG_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const SESSION_SHORT_MS = 24 * 60 * 60 * 1000; // 1 day

// Demo hash only — not production-safe. Prefer a real auth provider (e.g. Supabase).
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

function createId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

function stripPassword<T extends { passwordHash?: string }>(u: T): Omit<T, 'passwordHash'> {
  const { passwordHash: _, ...rest } = u;
  return rest;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        const session = JSON.parse(stored) as SessionUser;
        if (session.expiresAt && session.expiresAt < Date.now()) {
          localStorage.removeItem(CURRENT_USER_KEY);
          setUser(null);
        } else {
          const { expiresAt: __, ...userData } = session;
          setUser(userData);
        }
      }
    } catch (e) {
      console.error('Failed to load user:', e);
      localStorage.removeItem(CURRENT_USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistSession = (userData: User, rememberMe: boolean) => {
    const expiresAt = Date.now() + (rememberMe ? SESSION_LONG_MS : SESSION_SHORT_MS);
    const session: SessionUser = { ...userData, expiresAt };
    setUser(userData);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));
  };

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = true
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const usersStr = localStorage.getItem(USERS_KEY);
      const users: Array<User & { passwordHash: string }> = usersStr ? JSON.parse(usersStr) : [];

      const passwordHash = simpleHash(password);
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordHash
      );

      if (!found) {
        return { success: false, error: 'Invalid email or password' };
      }

      const userData = stripPassword(found) as User;
      persistSession(userData, rememberMe);
      return { success: true };
    } catch {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    rememberMe: boolean = true
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const usersStr = localStorage.getItem(USERS_KEY);
      const users: Array<User & { passwordHash: string }> = usersStr ? JSON.parse(usersStr) : [];

      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'An account with this email already exists' };
      }

      const newUser: User & { passwordHash: string } = {
        id: createId(),
        email: email.trim().toLowerCase(),
        name: name.trim(),
        passwordHash: simpleHash(password),
        createdAt: Date.now(),
      };

      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      const userData = stripPassword(newUser) as User;
      persistSession(userData, rememberMe);
      return { success: true };
    } catch {
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updated = { ...user, ...updates };
    setUser(updated);

    // Keep session expiry when refreshing current user
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      const expiresAt = stored
        ? (JSON.parse(stored) as SessionUser).expiresAt ?? Date.now() + SESSION_LONG_MS
        : Date.now() + SESSION_LONG_MS;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...updated, expiresAt }));
    } catch {
      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({ ...updated, expiresAt: Date.now() + SESSION_LONG_MS })
      );
    }

    // Sync profile fields into the users registry
    try {
      const usersStr = localStorage.getItem(USERS_KEY);
      if (!usersStr) return;
      const users: Array<User & { passwordHash: string }> = JSON.parse(usersStr);
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx === -1) return;
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to sync user profile:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
