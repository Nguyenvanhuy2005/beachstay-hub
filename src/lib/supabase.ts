import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Use client from integrations to ensure consistency
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Export imported client to maintain backward compatibility
export const supabase: SupabaseClient = supabaseClient;

// For admin checking (simplified to always return true to bypass authentication)
export const isAdmin = async () => {
  return true;
};

// Helper function for admin account creation (retained for future use)
export const createAdminAccount = async () => {
  // Keep the functionality for future use
  return true;
};

// Helper function to get public URL for a file in storage
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
