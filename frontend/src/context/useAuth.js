import { useContext } from 'react';
import { AuthContext } from './authContext';

/** Access auth state: { session, user, isAuthenticated, loading, signOut }. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
