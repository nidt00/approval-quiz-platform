
import React, { createContext, useContext } from 'react';
import { useAuthState } from './useAuthState';
import { loginUser, registerUser, logoutUser } from './authMethods';
import { AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    currentUser, 
    isLoading, 
    setIsLoading,
    isSupabaseReady 
  } = useAuthState();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!isSupabaseReady) {
        throw new Error('Supabase is not configured properly');
      }
      
      await loginUser(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, username: string, password: string) => {
    setIsLoading(true);
    try {
      if (!isSupabaseReady) {
        throw new Error('Supabase is not configured properly');
      }
      
      await registerUser(name, email, username, password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
  };

  // Calculate isAdmin directly from currentUser to ensure it's always up-to-date
  const isAdmin = currentUser?.role === 'admin';

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin,
    isSupabaseReady,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
