import { Routes, Route } from 'react-router';
import RootLayout from './components/layout/RootLayout';
import RequireOnboarding from './components/auth/RequireOnboarding';
import RequireAdmin from './components/auth/RequireAdmin';
import Landing from './pages/Landing';
import Roadmap from './pages/Roadmap';
import About from './pages/About';
import Contribute from './pages/Contribute';
import Guidelines from './pages/Guidelines';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import AdminRoadmap from './pages/AdminRoadmap';
import NotFound from './pages/NotFound';

/**
 * Route map (declarative mode).
 *
 * Groups:
 *   1. Standalone focus screens — OUTSIDE RootLayout, no nav chrome: /login, /signup,
 *      /onboarding.
 *   2. Admin screens — gated by RequireAdmin (non-admins redirected away). Standalone so
 *      the admin tools get a clean, full-width workspace.
 *   3. Main app routes — wrapped in RootLayout (Navbar + Footer + glow), and guarded by
 *      RequireOnboarding so a logged-in user who hasn't finished onboarding is redirected
 *      to /onboarding before they can use the app.
 */
export default function App() {
  return (
    <Routes>
      {/* Focus screens — no navbar/footer */}
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="onboarding" element={<Onboarding />} />

      {/* Admin — admin-only */}
      <Route
        path="admin/roadmap"
        element={
          <RequireAdmin>
            <AdminRoadmap />
          </RequireAdmin>
        }
      />

      {/* Everything else — full app shell, behind the onboarding gate */}
      <Route
        element={
          <RequireOnboarding>
            <RootLayout />
          </RequireOnboarding>
        }
      >
        <Route index element={<Landing />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="about" element={<About />} />
        <Route path="contribute" element={<Contribute />} />
        <Route path="guidelines" element={<Guidelines />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
