import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import Button from '../ui/Button';
import { useContributeModal } from '../../context/useContributeModal';
import { useAuth } from '../../context/useAuth';
import ProfileMenu from './ProfileMenu';

/**
 * Navbar — the persistent top navigation (Brand Identity v2.0, §7.4).
 *
 * Auth-aware: logged-out shows "Log in / Join for free"; logged-in shows a ProfileMenu
 * (avatar + dropdown with logout). State comes from useAuth(); while the initial session
 * check is loading, the auth slot is left empty to avoid flashing the wrong control.
 *
 * "Contribute" is auth-aware too: logged-out visitors get the conversion modal
 * (ContributeModal); logged-in members go straight to the /contribute page. Both the
 * desktop and mobile triggers route through `triggerContribute`, so the behaviour stays
 * consistent. It carries the pulsing green "exciting" badge.
 */
const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/about', label: 'About' },
  { label: 'Contribute', badge: 'exciting', modal: true },
];

function navLinkClass({ isActive }) {
  return (
    'text-body-md transition-colors duration-150 ' +
    (isActive ? 'text-amber-400' : 'text-text-secondary hover:text-text-primary')
  );
}

const IconMenu = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const IconClose = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

function Badge({ label, className }) {
  return (
    <span className={`animate-badge-pulse font-mono font-medium tracking-wide text-success-bright ${className}`} aria-hidden="true">
      {label}
    </span>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const { open: openContribute } = useContributeModal();
  const { isAuthenticated, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  function go(path) {
    setOpen(false);
    navigate(path);
  }
  // Auth-aware contribute: members go to the page, visitors get the conversion modal.
  function triggerContribute() {
    setOpen(false);
    if (isAuthenticated) {
      navigate('/contribute');
    } else {
      openContribute();
    }
  }
  async function handleMobileLogout() {
    setOpen(false);
    await signOut();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-base/80 backdrop-blur">
      <div className="absolute inset-x-0 top-0 h-px accent-line" />
      <nav className="mx-auto flex max-w-container items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span aria-hidden="true">☕</span>
          <span className="font-display text-heading-3 text-text-primary">JavaCup</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <span key={l.label} className="relative">
              {l.modal ? (
                <button type="button" onClick={triggerContribute} className={navLinkClass({ isActive: false })}>
                  {l.label}
                </button>
              ) : (
                <NavLink to={l.to} end={l.end} className={navLinkClass}>
                  {l.label}
                </NavLink>
              )}
              {l.badge ? <Badge label={l.badge} className="pointer-events-none absolute -top-2.5 -right-7 text-[9px]" /> : null}
            </span>
          ))}
        </div>

        {/* Desktop auth slot — login buttons or profile menu */}
        <div className="hidden items-center gap-2 md:flex">
          {loading ? null : isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
                Join for free
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-strong bg-raised text-text-primary md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? IconClose : IconMenu}
        </button>
      </nav>

      {/* Mobile dropdown panel */}
      {open ? (
        <div className="border-t border-border-subtle bg-base md:hidden">
          <div className="mx-auto flex max-w-container flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map((l) =>
              l.modal ? (
                <button
                  key={l.label}
                  type="button"
                  onClick={triggerContribute}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-body-md text-text-secondary transition-colors duration-150 hover:bg-raised hover:text-text-primary"
                >
                  {l.label}
                  {l.badge ? <Badge label={l.badge} className="text-[10px]" /> : null}
                </button>
              ) : (
                <NavLink
                  key={l.label}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    'flex items-center gap-2 rounded-md px-3 py-2 text-body-md transition-colors duration-150 ' +
                    (isActive ? 'bg-raised text-amber-400' : 'text-text-secondary hover:bg-raised hover:text-text-primary')
                  }
                >
                  {l.label}
                </NavLink>
              ),
            )}
            <div className="mt-2 flex flex-col gap-2 border-t border-border-subtle pt-3">
              {loading ? null : isAuthenticated ? (
                <Button variant="secondary" size="sm" className="w-full" onClick={handleMobileLogout}>
                  Log out
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => go('/login')}>
                    Log in
                  </Button>
                  <Button variant="primary" size="sm" className="w-full" onClick={() => go('/signup')}>
                    Join for free
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
