
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
    // Try to sign in with the admin credentials to check if account exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });
    
    // If sign in succeeds, the admin account already exists
    if (signInData?.user) {
      console.log('Admin account already exists and is valid');
      return true;
    }
    
    // If error is not "Invalid login credentials", it might be a different issue
    if (signInError && !signInError.message.includes('Invalid login credentials')) {
      console.error('Error checking if admin exists:', signInError);
    }
    
    // Attempt to create the admin account
    console.log('Admin account does not exist or password is incorrect. Creating account...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });
    
    if (signUpError) {
      // If sign up fails because the user already exists but with different password
      if (signUpError.message.includes('already registered')) {
        console.log('Admin email already registered but with different password');
        // In a real app, you might want to handle this differently
        return false;
      }
      
      console.error('Error creating admin account:', signUpError);
      return false;
    }
    
    if (signUpData?.user) {
      console.log('Admin account created successfully');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Unexpected error creating admin account:', error);
    return false;
  }
};
