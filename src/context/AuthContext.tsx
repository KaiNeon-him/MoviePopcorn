import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'moviepopcorn_users';
const CURRENT_USER_KEY = 'moviepopcorn_current_user';

// Simple hash for demo purposes (NOT secure - just for simulation)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load current user on mount
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load user:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const usersStr = localStorage.getItem(USERS_KEY);
      const users: Array<User & { passwordHash: string }> = usersStr ? JSON.parse(usersStr) : [];
      
      const passwordHash = simpleHash(password);
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordHash);
      
      if (!found) {
        return { success: false, error: 'Invalid email or password' };
      }

      const { passwordHash: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const usersStr = localStorage.getItem(USERS_KEY);
      const users: Array<User & { passwordHash: string }> = usersStr ? JSON.parse(usersStr) : [];
      
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'An account with this email already exists' };
      }

      const newUser: User & { passwordHash: string } = {
        id: Math.random().toString(36).substring(2, 15),
        email,
        name,
        passwordHash: simpleHash(password),
        createdAt: Date.now(),
      };

      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      const { passwordHash: _, ...userData } = newUser;
      setUser(userData);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      return { success: true };
    } catch (e) {
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
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
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
