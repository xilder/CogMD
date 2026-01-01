'use client';

import { getProfile, logout } from '@/services/api';
import { User } from '@/types/schemas';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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

  const userQuery = useQuery({
  queryKey: ['userProfile'],
  queryFn: getProfile
})

 useEffect(() => {
    if (userQuery.isSuccess && userQuery.data) {
      setUser(userQuery.data);
    }
    if (userQuery.isError || !userQuery.data) {
      setUser(null);
    }
  }, [userQuery.isSuccess, userQuery.isError, userQuery.data]);

  const value = useMemo(
    () => ({
      isAuthenticated: !!user,
      user,
      isLoading: userQuery.isLoading,
      updateUser,
      clientLogout,
    }),
    [user, isLoading, updateUser, clientLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
