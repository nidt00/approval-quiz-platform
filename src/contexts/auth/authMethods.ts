
import { supabase } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';

export async function loginUser(email: string, password: string) {
  console.log("Attempting to sign in with:", email);
  
  try {
    // Check if user exists in auth schema
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('email', email);
    
    if (countError) {
      console.error("Error checking if user exists:", countError);
    } else if (count === 0) {
      console.error("User does not exist in profiles table");
      throw new Error('No account found with this email');
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log("Sign in response:", data, error);
    
    if (error) {
      console.error("Sign in error:", error);
      throw error;
    }
    
    // Check if the user exists in the profiles table and has approved status
    if (data.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile after login:", profileError);
        throw new Error('Could not verify user status');
      }
      
      if (profileData && profileData.status !== 'approved') {
        console.warn("User not approved:", profileData.status);
        // Sign out the user if they are not approved
        await supabase.auth.signOut();
        throw new Error('Your account is pending approval by an administrator');
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
    
    return data;
  } catch (error) {
    throw new Error((error as Error).message || 'Error during registration');
  }
}

export async function logoutUser() {
  return await supabase.auth.signOut();
}
