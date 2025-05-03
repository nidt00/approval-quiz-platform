
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing!");
  console.error(`VITE_SUPABASE_URL: ${supabaseUrl ? "✓" : "✗"}`);
  console.error(`VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? "✓" : "✗"}`);
  
  // Instructions for users on how to fix this
  console.log("To fix this error:");
  console.log("1. Make sure you've connected your Lovable project to Supabase");
  console.log("2. In the Supabase project dashboard, go to Settings > API");
  console.log("3. Copy the URL and anon key");
  console.log("4. In your Lovable project, click on the Supabase button (top right)");
  console.log("5. Add these secrets in the environment variables section");
}

// Create a temporary supabase client if variables are missing (for development only)
// This will prevent the app from crashing completely during development
const url = supabaseUrl || 'https://placeholder-url.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

// Create and export the Supabase client
export const supabase = createClient<Database>(url, key);

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
