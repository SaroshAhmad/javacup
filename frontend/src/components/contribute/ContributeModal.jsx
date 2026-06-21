import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useContributeModal } from '../../context/useContributeModal';

/**
 * ContributeModal — conversion modal shown when a logged-out visitor clicks "Contribute".
 *
 * Brand-restrained, NOT glassmorphism: the backdrop dims + gently blurs the page behind,
 * but the modal itself is a normal surface card with a faint amber accent line. Sells
 * participation (build, ship, contribute), never gated information.
 *
 * Accessibility: closes on Escape and backdrop click, locks body scroll while open,
 * focuses the primary CTA on open. aria-modal + labelledby wired for screen readers.
 *
 * Phase B: this only needs to render for logged-out users — the auth gate lives in
 * the context's `open` (see ContributeModalContext), not here.
 */
const Icon = {
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]" aria-hidden="true">
      <path d="m8 9-3 3 3 3" /><path d="m16 9 3 3-3 3" /><path d="m14 7-4 10" />
    </svg>
  ),
  pr: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]" aria-hidden="true">
      <circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><path d="M6 8.5v7" />
      <circle cx="18" cy="18" r="2.5" /><path d="M18 15.5V11a4 4 0 0 0-4-4h-2.5" /><path d="m13 4-2 3 2 3" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  ),
};

const benefits = [
  ['code', 'text-[#E0A93C]', 'bg-[#1E1809]', 'border-[#3A2F16]', 'Write production code — React, Spring Boot, Postgres'],
  ['pr', 'text-[#34D399]', 'bg-[#0E2620]', 'border-[#16403A]', 'Merged PRs you can show employers'],
  ['users', 'text-[#A78BFA]', 'bg-[#1E1633]', 'border-[#2E2350]', 'Real code review and a community building together'],
];

export default function ContributeModal() {
  const { isOpen, close } = useContributeModal();
  const navigate = useNavigate();
  const ctaRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ctaRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  // Carry the user's intent (they clicked "Contribute") through auth, so they land back
  // on /contribute afterwards rather than the generic default.
  function goSignup() {
    close();
    navigate('/signup?redirect=%2Fcontribute');
  }
  function goLogin() {
    close();
    navigate('/login?redirect=%2Fcontribute');
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contribute-modal-title"
    >
      {/* Backdrop — dim + gentle blur (brand-restrained, not frosted glass) */}
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 cursor-default bg-[rgba(6,5,4,0.72)] backdrop-blur-sm"
      />

      {/* Modal card */}
      <div className="relative w-full max-w-md rounded-2xl border border-border-strong bg-surface p-8 shadow-2xl">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md border border-border-subtle bg-raised text-text-secondary transition-colors hover:text-text-primary"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-700/40 bg-amber-surface px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success-bright" />
          <span className="font-mono text-mono-label text-amber-400">now building · join us</span>
        </div>

        <h2 id="contribute-modal-title" className="font-display text-heading-2 text-text-primary">
          Build something real — <span className="text-amber-400">not another practice project.</span>
        </h2>

        <p className="mt-3 text-body-md text-text-secondary">
          Most developers learn by following tutorials. Very few get to ship real features on a
          live product a community actually uses. JavaCup is your chance to do the real thing.
        </p>

        <div className="mt-5 flex flex-col gap-2.5">
          {benefits.map(([icon, fg, chip, ring, text]) => (
            <div key={text} className="flex items-center gap-3">
              <span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${chip} ${ring} ${fg}`}>
                {Icon[icon]}
              </span>
              <span className="text-body-sm text-text-secondary">{text}</span>
            </div>
          ))}
        </div>

        <button
          ref={ctaRef}
          type="button"
          onClick={goSignup}
          className="mt-6 w-full rounded-lg bg-amber-500 px-4 py-3 font-medium text-amber-950 transition-colors hover:bg-amber-600"
        >
          Join JavaCup to start contributing
        </button>
        <p className="mt-2.5 text-center text-body-sm text-text-muted">
          Free forever. Takes a minute.{' '}
          <button type="button" onClick={goLogin} className="text-text-secondary underline hover:text-text-primary">
            Already a member? Log in
          </button>
        </p>
      </div>
    </div>
  );
}
