import { Routes, Route } from 'react-router';
import RootLayout from './components/layout/RootLayout';
import Landing from './pages/Landing';
import Roadmap from './pages/Roadmap';
import About from './pages/About';
import Contribute from './pages/Contribute';
import Guidelines from './pages/Guidelines';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

/**
 * Route map (declarative mode).
 *
 * Two groups:
 *   1. Main app routes — wrapped in RootLayout (Navbar + Footer + glow).
 *   2. Auth routes (/login, /signup) — standalone, OUTSIDE RootLayout, so they render
 *      as clean focus screens with no nav chrome (AuthShell provides their frame).
 */
export default function App() {
  return (
    <Routes>
      {/* Auth — no navbar/footer, clean focus screens */}
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />

      {/* Everything else — full app shell */}
      <Route element={<RootLayout />}>
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
