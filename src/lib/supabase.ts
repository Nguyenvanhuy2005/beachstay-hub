
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Kiểm tra xem biến môi trường có tồn tại không
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://frcweqzngmynlxjpgyjp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyY3dlcXpuZ215bmx4anBneWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNjU2NjUsImV4cCI6MjA1NzY0MTY2NX0.zHedDcbPuOGPFKyVODCwW8FuE9cldSmI1OY4YAZvW9s';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to create admin account
export const createAdminAccount = async () => {
  const adminEmail = 'admin@annamvillage.vn';
  const adminPassword = 'admin';
  
  try {
    // First check if the user exists in auth
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(adminEmail);
    
    // If auth error is not "User not found", it's likely a permission issue
    if (authError && !authError.message.includes('User not found')) {
      console.error('Error checking if admin exists:', authError);
      
      // Try sign-up method instead
      console.log('Attempting admin sign-up instead...');
      const { error: signUpError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
      });
      
      if (signUpError) {
        console.error('Error creating admin account:', signUpError);
        return false;
      }
      
      console.log('Admin account created successfully via sign-up');
      return true;
    }
    
    // If user doesn't exist, create it
    if (!authUser) {
      const { error } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
      });
      
      if (error) {
        console.error('Error creating admin account:', error);
        return false;
      }
      
      console.log('Admin account created successfully');
      return true;
    } else {
      console.log('Admin account already exists');
      return true;
    }
  } catch (error) {
    console.error('Unexpected error creating admin account:', error);
    
    // Fallback: try regular sign-up
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
      });
      
      if (signUpError) {
        console.error('Fallback signup also failed:', signUpError);
        return false;
      }
      
      console.log('Admin account created successfully via fallback');
      return true;
    } catch (fallbackError) {
      console.error('Fallback also failed with unexpected error:', fallbackError);
      return false;
    }
  }
};
