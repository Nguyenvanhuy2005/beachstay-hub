
// This edge function provides a secure way to reset the admin password
// Follow-up with instructions on how to use it after implementation

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

console.log('Reset admin password function loaded');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // This is a secure function with admin privileges
    // Only reset password for the specific admin user
    const adminEmail = 'admin@annamvillage.vn';
    const newPassword = 'Admin@123456';
    
    // Get the user by email to get the user ID
    const { data: userData, error: userError } = await supabaseClient.auth.admin
      .listUsers({
        filter: {
          email: adminEmail,
        },
      });
      
    if (userError) {
      console.error('Error finding admin user:', userError);
      return new Response(
        JSON.stringify({ error: 'Error finding admin user', details: userError }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
    
    if (!userData || !userData.users || userData.users.length === 0) {
      console.error('Admin user not found');
      return new Response(
        JSON.stringify({ error: 'Admin user not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }
    
    const userId = userData.users[0].id;
    
    // Update the user's password
    const { data: updateData, error: updateError } = await supabaseClient.auth.admin
      .updateUserById(userId, {
        password: newPassword,
      });
      
    if (updateError) {
      console.error('Error resetting admin password:', updateError);
      return new Response(
        JSON.stringify({ error: 'Error resetting admin password', details: updateError }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'Admin password reset successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
