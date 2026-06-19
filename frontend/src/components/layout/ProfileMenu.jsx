import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/useAuth';

/**
 * ProfileMenu — the logged-in replacement for the "Log in / Join for free" buttons.
 *
 * Shows an avatar circle (initial from the user's name/email) that opens a small dropdown:
 * the user's name + email, and a logout action. Profile / settings links slot in here
 * once those pages exist (Phase D). Closes on outside-click and Escape.
 */
function initialOf(user) {
  const name = user?.user_metadata?.name || user?.email || '?';
  return name.trim().charAt(0).toUpperCase();
}

export default function ProfileMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    await signOut();
    navigate('/');
  }

  const name = user?.user_metadata?.name || 'Member';
  const email = user?.email || '';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong bg-raised font-display text-body-md text-text-primary transition-colors hover:border-amber-400"
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {initialOf(user)}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-2xl"
        >
          <div className="border-b border-border-subtle px-4 py-3">
            <div className="truncate text-body-md text-text-primary">{name}</div>
            {email ? <div className="truncate text-body-sm text-text-muted">{email}</div> : null}
          </div>
          <div className="p-1">
            {/* Profile / settings links slot in here once those pages exist (Phase D). */}
            <Link
              to="/contribute"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-body-md text-text-secondary transition-colors hover:bg-raised hover:text-text-primary"
            >
              Contribute
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="block w-full rounded-md px-3 py-2 text-left text-body-md text-text-secondary transition-colors hover:bg-raised hover:text-text-primary"
            >
              Log out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
