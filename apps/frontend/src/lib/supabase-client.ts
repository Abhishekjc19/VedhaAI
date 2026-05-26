import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a function to get the Supabase client
// This ensures it's only created when actually needed, not during build
export const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Using dummy client for build.');
    // Return a dummy client for build time
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Export the client for backward compatibility
export const supabase = getSupabaseClient();

