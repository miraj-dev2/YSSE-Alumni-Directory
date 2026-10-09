import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isLoading: boolean;
  loginAs: (role: UserRole) => Promise<void>;
  updateUserAccount: (updates: Partial<User>) => Promise<User>;
  logout: () => Promise<void>;
  isRoleSelectorOpen: boolean;
  setIsRoleSelectorOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(false);

  useEffect(() => {
    authService.getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
  }, []);

  const loginAs = async (targetRole: UserRole) => {
    setIsLoading(true);
    const updated = await authService.loginAs(targetRole);
    setUser(updated);
    setIsLoading(false);
    setIsRoleSelectorOpen(false);
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

  const role: UserRole = user ? user.role : 'visitor';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        loginAs,
        updateUserAccount,
        logout,
        isRoleSelectorOpen,
        setIsRoleSelectorOpen,
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
