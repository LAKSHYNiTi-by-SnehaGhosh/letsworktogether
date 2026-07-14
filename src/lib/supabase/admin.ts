import { createClient } from '@supabase/supabase-js';

// Note: This client uses the SERVICE_ROLE_KEY and should ONLY be used in secure server environments 
// (like Route Handlers processing verified webhooks or Cron jobs). It bypasses all RLS policies.
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase URL or Service Role Key');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
