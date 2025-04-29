
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Initializing storage buckets");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // List existing buckets to check what already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      throw listError;
    }

    console.log("Existing buckets:", buckets.map(b => b.name).join(", ") || "none");

    // Define buckets we want to ensure exist
    const requiredBuckets = [
      { name: "blog-images", public: true },
      { name: "room-images", public: true },
      { name: "gallery", public: true }
    ];

    const results = [];

    // Create any missing buckets
    for (const bucket of requiredBuckets) {
      if (!buckets.find(b => b.name === bucket.name)) {
        console.log(`Creating bucket: ${bucket.name}`);
        const { data, error } = await supabase.storage.createBucket(
          bucket.name, 
          { public: bucket.public }
        );

        if (error) {
          console.error(`Error creating bucket ${bucket.name}:`, error);
          results.push({ bucket: bucket.name, success: false, error: error.message });
        } else {
          console.log(`Successfully created bucket: ${bucket.name}`);
          results.push({ bucket: bucket.name, success: true });
        }
      } else {
        console.log(`Bucket already exists: ${bucket.name}`);
        results.push({ bucket: bucket.name, success: true, existed: true });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error("Error in create-storage-buckets function:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }
});
