import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client singleton.
 *
 * Reads the project URL and anon (publishable) key from Vite env vars. The anon key is
 * safe to ship in frontend code — row-level security on the database is what protects
 * data, NOT secrecy of this key. The service_role key must NEVER appear in frontend code.
 *
 * Env vars live in frontend/.env.local (gitignored) and MUST be prefixed with VITE_ for
 * Vite to expose them. Restart the dev server after changing them.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to ' +
      'frontend/.env.local, then restart the dev server.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist the session in localStorage and refresh tokens automatically — Supabase's
    // built-in session manager. This is what keeps a user logged in across reloads.
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // needed for the OAuth redirect callback (Google, later)
  },
});
