
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
    console.log('Attempting to create admin account...');
    
    // First, try to create the account
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });
    
    if (signUpError) {
      // If the error indicates the user already exists, try to sign in
      if (signUpError.message.includes('already registered')) {
        console.log('Admin email already registered, attempting to sign in...');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        });
        
        if (signInError) {
          console.error('Error signing in with existing admin account:', signInError);
          return false;
        }
        
        if (signInData?.user) {
          console.log('Successfully signed in with existing admin account');
          return true;
        }
      } else {
        console.error('Error creating admin account:', signUpError);
        return false;
      }
    }
    
    if (signUpData?.user) {
      console.log('Admin account created successfully!');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Unexpected error during admin account setup:', error);
    return false;
  }
};
