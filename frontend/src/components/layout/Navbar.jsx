import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import Button from '../ui/Button';

/**
 * Navbar — the persistent top navigation (Brand Identity v2.0, §7.4).
 *
 * Logged-out state (the only state until auth ships in Sprint 2). The seam for the
 * logged-in state (profile menu / avatar) is marked below so it slots in cleanly.
 *
 * Desktop: logo · nav links · auth CTAs. Mobile: logo · hamburger → dropdown panel.
 */
const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/about', label: 'About' },
  { to: '/contribute', label: 'Contribute' },
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

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function go(path) {
    setOpen(false);
    navigate(path);
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
            <NavLink key={l.to} to={l.to} end={l.end} className={navLinkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop auth — logged-out state. (Logged-in profile menu slots in here.) */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
            Log in
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
            Join for free
          </Button>
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
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  'rounded-md px-3 py-2 text-body-md transition-colors duration-150 ' +
                  (isActive ? 'bg-raised text-amber-400' : 'text-text-secondary hover:bg-raised hover:text-text-primary')
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border-subtle pt-3">
              <Button variant="ghost" size="sm" className="w-full" onClick={() => go('/login')}>
                Log in
              </Button>
              <Button variant="primary" size="sm" className="w-full" onClick={() => go('/login')}>
                Join for free
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
