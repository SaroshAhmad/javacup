import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * RootLayout — the persistent app shell.
 * Navbar and Footer stay mounted across route changes; the matched page renders
 * into <Outlet />. A faint page-level glow sits behind everything.
 */
export default function RootLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-base text-text-primary">
      <div className="pointer-events-none fixed inset-0 glow-top" />
      <Navbar />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
