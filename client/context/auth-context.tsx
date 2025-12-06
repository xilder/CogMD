'use client';

import { getProfile, logout } from '@/services/api';
import { User } from '@/types/schemas';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  updateUser: (u: User | null) => void;
  clientLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  const updateUser = useCallback((u: User | null) => {
    if (u) {
      setJustLoggedOut(false);
    }
    setUser(u);
  }, []);

  const clientLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
      setIsLoading(false);
      setJustLoggedOut(true);
    }
  }, []);

  useEffect(() => {
    if (justLoggedOut) {
      setIsLoading(false);
      setUser(null);
    } else {
      const init = async () => {
        try {
          const profile = await getProfile();
          setUser(profile);
        } catch {
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      };

      init();
    }
    return () => {};
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: !!user,
      user,
      isLoading,
      updateUser,
      clientLogout,
    }),
    [user, isLoading, updateUser, clientLogout]
  );

  // useEffect(
  //   () => console.log(isLoading, justLoggedOut),
  //   [isLoading, justLoggedOut]
  // );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
