
import { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { toUserRole, toUserStatus } from './utils';

export function useAuthState() {
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
        console.log("Fetching auth session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setIsLoading(false);
          return;
        }
        
        console.log("Session data:", data);
        if (data?.session?.user) {
          setSupabaseUser(data.session.user);
          console.log("User from session:", data.session.user);
          
          try {
            // Fetch additional user data from profiles table
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.session.user.id)
              .single();
            
            if (profileError) {
              if (profileError.code === 'PGRST116') {
                console.log("No profile found for user, using fallback data");
                
                // Create a fallback user for testing (with admin role)
                const fallbackUser: User = {
                  id: data.session.user.id,
                  name: "Admin User",
                  email: data.session.user.email || "admin@example.com",
                  username: "admin",
                  role: "admin",
                  status: "approved",
                  createdAt: new Date(),
                };
                setCurrentUser(fallbackUser);
              } else {
                console.error("Error fetching profile:", profileError);
              }
            } else if (profileData) {
              console.log("Profile data:", profileData);
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
          } catch (profileError) {
            console.error("Error in profile processing:", profileError);
            
            // Create a fallback user with basic data from auth
            const fallbackUser: User = {
              id: data.session.user.id,
              name: "User",
              email: data.session.user.email || "user@example.com",
              username: "user",
              role: "student",
              status: "approved",
              createdAt: new Date(),
            };
            setCurrentUser(fallbackUser);
          }
        } else {
          console.log("No active session found");
          setCurrentUser(null);
          setSupabaseUser(null);
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
        console.log("Auth state changed:", event);
        if (session?.user) {
          setSupabaseUser(session.user);
          console.log("User from auth state change:", session.user);
          
          try {
            // Fetch profile data
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (error) {
              if (error.code === 'PGRST116') {
                console.log("No profile found in auth state change, using fallback");
                
                // Use fallback data for testing
                const fallbackUser: User = {
                  id: session.user.id,
                  name: "Admin User",
                  email: session.user.email || "admin@example.com",
                  username: "admin",
                  role: "admin",
                  status: "approved",
                  createdAt: new Date(),
                };
                setCurrentUser(fallbackUser);
              } else {
                console.error('Error fetching profile:', error);
              }
            } else if (profile) {
              console.log("Profile from auth state change:", profile);
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
            }
          } catch (error) {
            console.error('Error in auth state change handler:', error);
            
            // Fallback to basic user data
            const fallbackUser: User = {
              id: session.user.id,
              name: "User",
              email: session.user.email || "user@example.com",
              username: "user",
              role: "student",
              status: "approved",
              createdAt: new Date(),
            };
            setCurrentUser(fallbackUser);
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

  return {
    currentUser,
    setCurrentUser,
    isLoading,
    setIsLoading,
    supabaseUser,
    setSupabaseUser,
    isSupabaseReady
  };
}
