import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { apiFetch } from '../lib/api';
import { AuthContext } from './authContext';

/**
 * AuthProvider — single source of truth for authentication state.
 *
 * On mount it reads any existing session (so a logged-in user stays logged in across
 * reloads), then subscribes to Supabase auth changes. Every login, logout, and silent
 * token refresh updates state here, and the whole app re-renders accordingly.
 *
 * When a session is present it performs the backend handshake (POST /api/v1/auth/sync),
 * which reports whether onboarding is required and whether the user is an admin. Both are
 * exposed on the context (`onboardingRequired`, `isAdmin`) so routing and admin-only UI
 * can react without extra requests. Sync failures are non-fatal: the user stays logged in;
 * status simply stays unknown until the next attempt.
 *
 * `loading` is true until the initial session check resolves; `syncing` is true while the
 * backend handshake is in flight.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [onboardingRequired, setOnboardingRequired] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const runSync = useCallback(async () => {
    setSyncing(true);
    try {
      const res = await apiFetch('/api/v1/auth/sync', { method: 'POST' });
      setOnboardingRequired(res?.onboardingRequired ?? null);
      setIsAdmin(res?.isAdmin ?? false);
    } catch {
      setOnboardingRequired(null);
      setIsAdmin(false);
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
      if (data.session) runSync();
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setLoading(false);
      if (newSession && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
        runSync();
      }
      if (!newSession) {
        setOnboardingRequired(null);
        setIsAdmin(false);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [runSync]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setOnboardingRequired(null);
    setIsAdmin(false);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session?.user,
      loading,
      syncing,
      onboardingRequired,
      isAdmin,
      refreshSync: runSync,
      signOut,
    }),
    [session, loading, syncing, onboardingRequired, isAdmin, runSync, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
