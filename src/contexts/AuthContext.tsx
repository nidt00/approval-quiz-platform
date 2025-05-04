import React, { createContext, useState, useContext, useEffect } from 'react';
import { User as SupabaseUser, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User, UserRole, UserStatus } from '../types';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSupabaseReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to convert string to UserStatus
const toUserStatus = (status: string): UserStatus => {
  if (status === 'pending' || status === 'approved' || status === 'rejected') {
    return status as UserStatus;
  }
  return 'pending'; // Default value if status is not a valid UserStatus
};

// Helper function to convert string to UserRole
const toUserRole = (role: string): UserRole => {
  if (role === 'admin' || role === 'student') {
    return role as UserRole;
  }
  return 'student'; // Default value if role is not a valid UserRole
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isSupabaseReady, setIsSupabaseReady] = useState(true);

  // Check for user session on initial load
  useEffect(() => {
    const fetchUser = async () => {
      if (!isSupabaseReady) {
        setIsLoading(false);
        toast({
          title: "Supabase Configuration Error",
          description: "Supabase environment variables are missing. Please check the console for instructions.",
          variant: "destructive",
          duration: 10000,
        });
        return;
      }
      
      setIsLoading(true);
      
      try {
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
              role: toUserRole(profileData.role),
              status: toUserStatus(profileData.status),
              createdAt: new Date(profileData.created_at),
            };
            setCurrentUser(user);
          }
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to fetch user session. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
    
    if (isSupabaseReady) {
      // Set up auth state change subscription
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user);
          
          try {
            // Fetch profile data
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (profile && !error) {
              const user: User = {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                username: profile.username,
                role: toUserRole(profile.role),
                status: toUserStatus(profile.status),
                createdAt: new Date(profile.created_at),
              };
              setCurrentUser(user);
            } else if (error) {
              console.error('Error fetching profile:', error);
            }
          } catch (error) {
            console.error('Error in auth state change handler:', error);
          }
        } else {
          setSupabaseUser(null);
          setCurrentUser(null);
        }
      });
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [isSupabaseReady]);

  const login = async (email: string, password: string) => {
    if (!isSupabaseReady) {
      throw new Error('Supabase is not configured properly');
    }
    
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
    if (!isSupabaseReady) {
      throw new Error('Supabase is not configured properly');
    }
    
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
    if (isSupabaseReady) {
      await supabase.auth.signOut();
    }
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
    isSupabaseReady,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
