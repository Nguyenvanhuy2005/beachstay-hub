
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
    console.log('Starting admin account setup process...');
    
    // First try signing in to see if account exists and credentials are valid
    console.log('Attempting to sign in with admin credentials...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });
    
    // If sign in succeeds, the account exists and credentials are valid
    if (signInData?.user) {
      console.log('Admin auth account exists and credentials are valid');
      
      // Ensure the admin record exists in admin_users table
      const { error: upsertError } = await supabase
        .from('admin_users')
        .upsert([{ email: adminEmail, is_active: true }], { 
          onConflict: 'email',
          ignoreDuplicates: false 
        });
      
      if (upsertError) {
        console.error('Error ensuring admin record:', upsertError);
      } else {
        console.log('Admin record ensured in admin_users table');
      }
      
      return true;
    }
    
    // If we couldn't sign in, we need to create the account
    console.log('Admin account sign-in failed, attempting to create account...');
    
    // Try to sign up with admin credentials
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });
    
    if (signUpError) {
      // If the error is that the user already exists but with wrong password
      if (signUpError.message.includes('already registered')) {
        console.log('Admin account exists but password may be wrong, trying to reset password...');
        return false;
      }
      
      console.error('Error creating admin auth account:', signUpError);
      return false;
    }
    
    if (signUpData?.user) {
      console.log('Admin auth account created successfully!');
      
      // Create admin record in admin_users table
      const { error: insertError } = await supabase
        .from('admin_users')
        .upsert([{ email: adminEmail, is_active: true }], { onConflict: 'email' });
      
      if (insertError) {
        console.error('Error creating admin record:', insertError);
      } else {
        console.log('Admin record created in admin_users table');
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Unexpected error during admin account setup:', error);
    return false;
  }
};

// Helper function to validate admin status using the RPC function
export const isAdmin = async (email: string) => {
  try {
    console.log('Checking admin status for:', email);
    
    // Use the RPC function we created in the SQL migration
    const { data, error } = await supabase.rpc('check_is_admin', { 
      email_param: email 
    });
    
    if (error) {
      console.error('Error checking admin status via RPC:', error);
      return false;
    }
    
    console.log('Admin check result:', !!data);
    return !!data;
  } catch (error) {
    console.error('Unexpected error checking admin status:', error);
    return false;
  }
};
