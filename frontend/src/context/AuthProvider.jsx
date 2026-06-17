import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from './authContext';

/**
 * AuthProvider — single source of truth for authentication state.
 *
 * On mount it reads any existing session (so a logged-in user stays logged in across
 * reloads), then subscribes to Supabase auth changes. Every login, logout, and silent
 * token refresh updates `user`/`session` here, and the whole app re-renders accordingly.
 *
 * `loading` is true until the initial session check resolves — gate UI that depends on
 * auth (e.g. "show login vs profile menu") on this so it doesn't flash the wrong state.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // 1. Initial session (from Supabase's persisted storage).
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    // 2. Subscribe to all future auth changes.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    // onAuthStateChange will clear session, but clear eagerly for snappy UI.
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session?.user,
      loading,
      signOut,
    }),
    [session, loading, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
