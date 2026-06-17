import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';
import ContributeModal from '../contribute/ContributeModal';

/**
 * RootLayout — the persistent app shell.
 * Navbar and Footer stay mounted across route changes; the matched page renders
 * into <Outlet />. The ContributeModal lives here so it can overlay any page and be
 * triggered from the navbar or footer.
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
      <ContributeModal />
    </div>
  );
}
