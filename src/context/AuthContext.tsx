import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { User, UserRole } from '../types';

export type AuthModalMode = 'login' | 'register';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isLoading: boolean;
  loginWithCredentials: (email: string, password?: string) => Promise<void>;
  registerUser: (data: {
    name: string;
    email: string;
    password?: string;
    role: 'member' | 'alumni';
  }) => Promise<void>;
  loginWithGoogle: (idToken?: string) => Promise<void>;
  updateUserAccount: (updates: Partial<User>) => Promise<User>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');

  useEffect(() => {
    authService.getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
  }, []);

  const loginWithCredentials = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const loggedIn = await authService.loginWithCredentials(email, password);
      setUser(loggedIn);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (data: {
    name: string;
    email: string;
    password?: string;
    role: 'member' | 'alumni';
  }) => {
    setIsLoading(true);
    try {
      const registered = await authService.registerUser(data);
      setUser(registered);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (idToken?: string) => {
    setIsLoading(true);
    try {
      const loggedIn = await authService.loginWithGoogle(idToken || '');
      setUser(loggedIn);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserAccount = async (updates: Partial<User>) => {
    const updated = await authService.updateUser(updates);
    setUser(updated);
    return updated;
  };

  const logout = async () => {
    setIsLoading(true);
    await authService.logout();
    setUser(null);
    setIsLoading(false);
  };

  const openAuthModal = (mode: AuthModalMode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const role: UserRole = user ? user.role : 'visitor';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        loginWithCredentials,
        registerUser,
        loginWithGoogle,
        updateUserAccount,
        logout,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
