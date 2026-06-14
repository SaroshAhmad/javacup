import { Routes, Route } from 'react-router';
import RootLayout from './components/layout/RootLayout';
import Landing from './pages/Landing';
import Roadmap from './pages/Roadmap';
import About from './pages/About';
import Contribute from './pages/Contribute';
import Guidelines from './pages/Guidelines';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

/**
 * Route map (declarative mode).
 *
 *   /            Landing    (index)
 *   /roadmap     Roadmap
 *   /about       About
 *   /contribute  Contribute (join-the-build + Web3Forms form)
 *   /login       Login
 *   *            NotFound   (catch-all 404)
 */
export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Landing />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="about" element={<About />} />
        <Route path="contribute" element={<Contribute />} />
        <Route path="guidelines" element={<Guidelines />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
