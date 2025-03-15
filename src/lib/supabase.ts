
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
    console.log('Checking if admin exists in admin_users table...');
    
    // First check if the email exists in our admin_users table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', adminEmail)
      .single();
    
    if (adminError) {
      console.error('Error checking admin status:', adminError);
      return false;
    }
    
    if (!adminData) {
      console.log('Admin not found in admin_users table, creating record...');
      
      // Create admin in the admin_users table
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert([{ email: adminEmail, is_active: true }]);
        
      if (insertError) {
        console.error('Error inserting admin record:', insertError);
        return false;
      }
      
      console.log('Admin record created successfully in admin_users table');
    } else {
      console.log('Admin found in admin_users table:', adminData);
    }
    
    // Try signing in first to see if account exists
    console.log('Attempting to sign in with admin credentials...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });
    
    // If sign in succeeds, the account exists
    if (signInData?.user) {
      console.log('Admin auth account exists and credentials are valid');
      return true;
    }
    
    // If sign in fails, try to create the account
    console.log('Sign in failed:', signInError?.message);
    console.log('Attempting to create admin auth account...');
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });
    
    if (signUpError) {
      console.error('Error creating admin auth account:', signUpError);
      return false;
    }
    
    if (signUpData?.user) {
      console.log('Admin auth account created successfully!', signUpData.user);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Unexpected error during admin account setup:', error);
    return false;
  }
};

// Helper function to validate admin status
export const isAdmin = async (email: string) => {
  try {
    console.log('Checking if email is admin:', email);
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    console.log('Admin check result:', !!data);
    return !!data;
  } catch (error) {
    console.error('Unexpected error checking admin status:', error);
    return false;
  }
};
