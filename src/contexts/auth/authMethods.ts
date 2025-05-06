
import { supabase } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';

export async function loginUser(email: string, password: string) {
  console.log("Attempting to sign in with:", email);
  
  try {
    // Sign in with credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log("Sign in response:", data, error);
    
    if (error) {
      console.error("Sign in error:", error);
      throw error;
    }
    
    // For demonstration purposes, attempting to log in even without profile check
    // Check if the user exists in the profiles table and has approved status
    if (data.user) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        console.log("Profile data:", profileData, "Profile error:", profileError);
        
        if (profileError) {
          if (profileError.code === 'PGRST116') {
            console.log("No profile found, this might be expected in development");
          } else {
            console.error("Error fetching profile after login:", profileError);
            // We'll continue anyway for testing purposes
          }
        } else if (profileData) {
          console.log("Profile data found:", profileData);
          
          // For admin accounts, don't require approval status check
          if (profileData.role !== 'admin' && profileData.status !== 'approved') {
            console.warn("User not approved:", profileData.status);
            // For testing purposes, we'll allow the login anyway
            // When ready to enforce approval, uncomment the following:
            /* 
            await supabase.auth.signOut();
            throw new Error('Your account is pending approval by an administrator');
            */
          }
        }
      } catch (profileFetchError) {
        console.error("Error in profile check:", profileFetchError);
        // Continue with login even if profile check fails for testing purposes
      }
    }
    
    return data;
  } catch (error) {
    const authError = error as AuthError;
    console.error("Login failed:", authError);
    throw new Error(authError.message || 'Error logging in');
  }
}

export async function registerUser(name: string, email: string, username: string, password: string) {
  try {
    console.log("Registering user:", email);
    
    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    console.log("Signup response:", data, error);
    
    if (error) throw error;
    
    if (data.user) {
      console.log("Creating profile for user:", data.user.id);
      
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
      
      if (profileError) {
        console.error("Error creating profile:", profileError);
        throw profileError;
      }
      
      console.log("Profile created successfully");
    }
    
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error((error as Error).message || 'Error during registration');
  }
}

export async function logoutUser() {
  return await supabase.auth.signOut();
}
