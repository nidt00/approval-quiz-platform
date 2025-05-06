
import React, { createContext, useContext, useEffect } from 'react';
import { useAuthState } from './useAuthState';
import { loginUser, registerUser, logoutUser } from './authMethods';
import { AuthContextType } from './types';
import { useNavigate } from 'react-router-dom';

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
    isSupabaseReady,
    setCurrentUser
  } = useAuthState();
  
  // Calculate isAdmin directly from currentUser to ensure it's always up-to-date
  const isAdmin = !!currentUser && currentUser.role === 'admin';
  const isAuthenticated = !!currentUser;

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!isSupabaseReady) {
        throw new Error('Supabase is not configured properly');
      }
      
      const result = await loginUser(email, password);
      console.log("Login successful, result:", result);
      
      // Note: We don't need to manually set currentUser here as it will be
      // updated through the auth state change subscription in useAuthState
      
      return result;
    } catch (error) {
      console.error("Login error in AuthProvider:", error);
      throw error;
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
      
      return await registerUser(name, email, username, password);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    isSupabaseReady,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
