import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../context/useAuth';

/**
 * RequireOnboarding — wraps the app shell. If a logged-in user has not completed
 * onboarding (onboardingRequired === true), redirect them to /onboarding so they finish
 * before using the rest of the app. Guests and onboarded members pass straight through.
 *
 * While auth/sync is still resolving (onboardingRequired === null), we render children
 * rather than redirect, to avoid a flash-redirect before status is known.
 */
export default function RequireOnboarding({ children }) {
  const { isAuthenticated, onboardingRequired } = useAuth();
  const location = useLocation();

  if (isAuthenticated && onboardingRequired === true && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}
