import { Navigate } from 'react-router';
import { useAuth } from '../../context/useAuth';

/**
 * RequireAdmin — gates admin-only routes. Redirects anyone who is not a signed-in admin
 * away to the home page. While auth is still resolving (loading or sync in flight) it
 * renders nothing, to avoid briefly flashing the page or a wrong redirect before admin
 * status is known.
 *
 * This is defence-in-depth on the client; the backend independently enforces admin on
 * every admin endpoint, so hiding the UI is convenience, not the security boundary.
 */
export default function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin, loading, syncing } = useAuth();

  if (loading || syncing) return null;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/" replace />;
  return children;
}
