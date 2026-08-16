import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AUTH_USER_KEY,
  ACCOUNTS_STORAGE_KEY,
} from '../utils/constants';

interface User {
  username: string;
  email: string;
}

interface Account {
  username: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredAccounts(): Account[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
  }

  return [];
}

function saveAccounts(accounts: Account[]) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

function getStoredUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed.username === 'string' && typeof parsed.email === 'string') {
      return parsed;
    }
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
  }

  return null;
}

function persistUser(user: User | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!user) {
    localStorage.removeItem(AUTH_USER_KEY);
    return;
  }

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function hashPassword(password: string) {
  return btoa(password);
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  useEffect(() => {
    persistUser(user);
  }, [user]);

  const login = useCallback(async (identifier: string, password: string) => {
    const normalized = identifier.trim().toLowerCase();
    const accounts = getStoredAccounts();
    const hashed = hashPassword(password);

    const account = accounts.find(
      (row) =>
        row.username.toLowerCase() === normalized || row.email.toLowerCase() === normalized
    );

    if (!account || account.password !== hashed) {
      throw new Error('Invalid username/email or password');
    }

    setUser({ username: account.username, email: account.email });
  }, []);

  const signUp = useCallback(async (username: string, email: string, password: string) => {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
      throw new Error('Please fill in all fields');
    }

    const accounts = getStoredAccounts();
    const duplicate = accounts.some(
      (account) =>
        account.username.toLowerCase() === trimmedUsername.toLowerCase() ||
        account.email.toLowerCase() === trimmedEmail
    );

    if (duplicate) {
      throw new Error('A user with that username or email already exists');
    }

    const nextAccount: Account = {
      username: trimmedUsername,
      email: trimmedEmail,
      password: hashPassword(trimmedPassword),
    };

    const nextAccounts = [...accounts, nextAccount];
    saveAccounts(nextAccounts);
    setUser({ username: nextAccount.username, email: nextAccount.email });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      signUp,
      logout,
    }),
    [user, login, signUp, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
