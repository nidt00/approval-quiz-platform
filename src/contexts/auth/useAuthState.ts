
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
          
          // Fetch additional user data from profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
          
          if (profileError) {
            console.error("Error fetching profile:", profileError);
          }  
            
          if (profileData) {
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
        } else {
          console.log("No active session found");
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
              console.error('Error fetching profile:', error);
            }
              
            if (profile) {
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

              // Check if user is approved - skip this check for admin users
              if (user.role !== 'admin' && user.status !== 'approved') {
                console.warn("User is not approved:", user.status);
                toast({
                  title: "Account Not Approved",
                  description: "Your account is pending approval by an administrator.",
                  variant: "destructive",
                });
                // Log them out if they're not approved
                if (user.status === 'pending' || user.status === 'rejected') {
                  await supabase.auth.signOut();
                  setCurrentUser(null);
                  setSupabaseUser(null);
                }
              }
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
