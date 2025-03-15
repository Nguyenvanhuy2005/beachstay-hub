
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key (required for admin operations)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Define the buckets to create
    const bucketsToCreate = [
      {
        name: 'images',
        public: true,
      }
    ];

    // Try to create each bucket
    const results = await Promise.all(
      bucketsToCreate.map(async (bucket) => {
        try {
          // Check if bucket already exists
          const { data: existingBucket, error: getBucketError } = await supabaseAdmin
            .storage
            .getBucket(bucket.name);

          if (getBucketError && getBucketError.message !== 'The resource was not found') {
            throw getBucketError;
          }

          if (existingBucket) {
            return { name: bucket.name, status: 'already_exists' };
          }

          // Create the bucket
          const { data, error } = await supabaseAdmin
            .storage
            .createBucket(bucket.name, {
              public: bucket.public,
              fileSizeLimit: 10485760, // 10MB
            });

          if (error) {
            throw error;
          }

          return { name: bucket.name, status: 'created' };
        } catch (error) {
          return { name: bucket.name, status: 'error', error: error.message };
        }
      })
    );

    return new Response(
      JSON.stringify({ buckets: results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
