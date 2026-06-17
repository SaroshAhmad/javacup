import { Link } from 'react-router';
import Button from '../ui/Button';

/**
 * AuthShell — shared frame for the login and signup pages.
 *
 * These pages render OUTSIDE RootLayout (no Navbar/Footer) so the screen is a clean,
 * focused surface with nothing competing with the single task. Provides: a back arrow
 * to the landing page, the brand mark, heading/subtext, the "continue with Google"
 * button, an "or" divider, the page-specific form (children), and a footer link.
 *
 * A whisper-faint dot texture sits behind the card — "felt, not seen".
 *
 * NOTE (Phase B): onGoogle is a seam for supabase.auth.signInWithOAuth.
 */
const GoogleMark = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 7.9-21l5.7-5.7A20 20 0 1 0 24 44c11 0 20-9 20-20 0-1.3-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5.1A20 20 0 0 0 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C40.9 36.5 44 31 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </svg>
);

const BackArrow = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export default function AuthShell({ eyebrow, title, subtitle, googleLabel, onGoogle, children, footer }) {
  return (
    <div className="relative min-h-screen bg-base text-text-primary">
      {/* whisper-faint texture — very subtle, fades out downward */}
      <div className="pointer-events-none absolute inset-0 bg-dot-grid mask-fade-b" />

      {/* back to landing */}
      <Link
        to="/"
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-body-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        {BackArrow}
        Back
      </Link>

      <div className="relative mx-auto flex max-w-form flex-col px-4 py-20">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <span aria-hidden="true">☕</span>
            <span className="font-display text-heading-3 text-text-primary">JavaCup</span>
          </Link>
          <div className="mt-6 font-mono text-mono-label text-text-muted">{eyebrow}</div>
          <h1 className="mt-2 font-display text-heading-1 text-text-primary">{title}</h1>
          <p className="mx-auto mt-3 max-w-sm text-body-md text-text-secondary">{subtitle}</p>
        </div>

        <div className="mt-8 rounded-xl border border-border-subtle bg-surface p-6">
          <Button variant="secondary" className="w-full" onClick={onGoogle}>
            {GoogleMark}
            {googleLabel}
          </Button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-border-subtle" />
            <span className="font-mono text-mono-label text-text-muted">or</span>
            <span className="h-px flex-1 bg-border-subtle" />
          </div>

          {children}
        </div>

        <p className="mt-6 text-center text-body-sm text-text-secondary">{footer}</p>
      </div>
    </div>
  );
}
