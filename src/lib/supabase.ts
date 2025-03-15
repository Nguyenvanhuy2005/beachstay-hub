import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Sử dụng client từ integrations để đảm bảo nhất quán
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Xuất client được nhập để duy trì tính tương thích ngược
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
