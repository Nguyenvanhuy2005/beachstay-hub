
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
    // First try signing in to see if account exists
    console.log('Attempting to sign in with admin credentials...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });
    
    // If sign in succeeds, the account exists
    if (signInData?.user) {
      console.log('Admin auth account exists and credentials are valid');
      
      // Try to ensure the admin record exists in admin_users table (without checking first to avoid RLS issues)
      const { error: insertError } = await supabase
        .from('admin_users')
        .upsert([{ email: adminEmail, is_active: true }], { onConflict: 'email' });
      
      if (insertError) {
        console.error('Error ensuring admin record:', insertError);
      } else {
        console.log('Admin record ensured in admin_users table');
      }
      
      return true;
    }
    
    // If sign in fails with invalid credentials, create the account
    if (signInError && signInError.message.includes('Invalid login credentials')) {
      console.log('Admin account does not exist, creating it...');
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
      });
      
      if (signUpError) {
        console.error('Error creating admin auth account:', signUpError);
        return false;
      }
      
      if (signUpData?.user) {
        console.log('Admin auth account created successfully!');
        
        // Create admin record in admin_users table
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert([{ email: adminEmail, is_active: true }]);
        
        if (insertError) {
          console.error('Error creating admin record:', insertError);
        } else {
          console.log('Admin record created in admin_users table');
        }
        
        return true;
      }
    } else if (signInError) {
      console.error('Unexpected sign in error:', signInError);
    }
    
    return false;
  } catch (error) {
    console.error('Unexpected error during admin account setup:', error);
    return false;
  }
};

// Helper function to validate admin status - simplified to avoid RLS issues
export const isAdmin = async (email: string) => {
  if (email === 'admin@annamvillage.vn') {
    console.log('Default admin detected, approving');
    return true;
  }
  
  // For non-default admins, check the table
  try {
    // Use a direct SQL query via RPC to bypass RLS
    const { data, error } = await supabase.rpc('check_is_admin', { email_param: email });
    
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
