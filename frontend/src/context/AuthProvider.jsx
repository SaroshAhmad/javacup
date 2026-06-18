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
 * When a session is present, it also performs the backend handshake: POST /api/v1/auth/sync
 * confirms the user to our backend and reports whether onboarding is still required. The
 * result is exposed as `onboardingRequired` so routing (e.g. send new users to onboarding
 * once that exists — Phase D) can react to it. Sync failures are non-fatal: the user stays
 * logged in; we just don't have a synced status yet.
 *
 * `loading` is true until the initial session check resolves; `syncing` is true while the
 * backend handshake is in flight.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [onboardingRequired, setOnboardingRequired] = useState(null);

  // Backend handshake — runs whenever we gain a session.
  const runSync = useCallback(async () => {
    setSyncing(true);
    try {
      const res = await apiFetch('/api/v1/auth/sync', { method: 'POST' });
      setOnboardingRequired(res?.onboardingRequired ?? null);
    } catch {
      // Non-fatal: keep the user logged in; status stays unknown until next attempt.
      setOnboardingRequired(null);
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
      // Re-sync on sign-in / token refresh; clear status on sign-out.
      if (newSession && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
        runSync();
      }
      if (!newSession) setOnboardingRequired(null);
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
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session?.user,
      loading,
      syncing,
      onboardingRequired,
      refreshSync: runSync,
      signOut,
    }),
    [session, loading, syncing, onboardingRequired, runSync, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
