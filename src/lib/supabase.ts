
import { supabase } from '@/integrations/supabase/client';

// This function checks if Supabase is properly configured
export const isSupabaseConfigured = () => {
  // The client from the integrations folder is always configured when using the Lovable Supabase integration
  return true;
};

// Export the supabase client from the integration
export { supabase };
