import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL || '').trim();
const supabaseKey = (import.meta.env.PUBLIC_SUPABASE_KEY || import.meta.env.SUPABASE_KEY || '').trim();

let clientInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (clientInstance) return clientInstance;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  try {
    clientInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });
    return clientInstance;
  } catch (err) {
    console.warn('[Supabase] Failed to initialize client:', err);
    return null;
  }
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
export const supabase = getSupabase();
