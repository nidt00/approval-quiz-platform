
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User as SupabaseUser, AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);

  // Check for user session on initial load
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setSupabaseUser(data.session.user);
        
        // Fetch additional user data from profiles table
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileData && !error) {
          const user: User = {
            id: profileData.id,
            name: profileData.name,
            email: profileData.email,
            username: profileData.username,
            role: profileData.role,
            status: profileData.status,
            createdAt: new Date(profileData.created_at),
          };
          setCurrentUser(user);
        }
      }
      
      setIsLoading(false);
    };
    
    fetchUser();
    
    // Set up auth state change subscription
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        
        // Fetch profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          const user: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            username: profile.username,
            role: profile.role,
            status: profile.status,
            createdAt: new Date(profile.created_at),
          };
          setCurrentUser(user);
        }
      } else {
        setSupabaseUser(null);
        setCurrentUser(null);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
    } catch (error) {
      const authError = error as AuthError;
      setIsLoading(false);
      throw new Error(authError.message || 'Error logging in');
    }
    
    setIsLoading(false);
  };

  const register = async (name: string, email: string, username: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create a profile record
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          name,
          email,
          username,
          role: 'student',
          status: 'pending',
          created_at: new Date().toISOString(),
        });
        
        if (profileError) throw profileError;
      }
      
    } catch (error) {
      setIsLoading(false);
      throw new Error((error as Error).message || 'Error during registration');
    }
    
    setIsLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setSupabaseUser(null);
  };

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
