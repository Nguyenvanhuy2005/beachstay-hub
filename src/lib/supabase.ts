
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Kiểm tra xem biến môi trường có tồn tại không
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://frcweqzngmynlxjpgyjp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyY3dlcXpuZ215bmx4anBneWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNjU2NjUsImV4cCI6MjA1NzY0MTY2NX0.zHedDcbPuOGPFKyVODCwW8FuE9cldSmI1OY4YAZvW9s';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
