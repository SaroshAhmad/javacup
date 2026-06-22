import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/useAuth';
import { useContributeModal } from '../../context/useContributeModal';

/**
 * Footer — navigation + trust signals (Brand Identity v2.0, §7.4 / S8).
 * Logo + tagline, organised link columns, community guidelines, GitHub.
 *
 * "Contribute" is auth-aware and matches the navbar exactly: logged-in members go to the
 * /contribute page, logged-out visitors get the conversion modal. It is therefore rendered
 * as an action (button) rather than a plain link, while every other footer entry stays a
 * normal Link.
 */
const COLUMNS = [
  {
    heading: 'Learn',
    links: [
      { label: 'Roadmap', to: '/roadmap' },
      { label: 'About', to: '/about' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { label: 'Contribute', contribute: true, badge: 'exciting' },
      { label: 'Guidelines', to: '/guidelines' },
    ],
  },
];

const GITHUB_URL = 'https://github.com/SaroshAhmad/javacup';

const linkClass =
  'text-body-md text-text-secondary transition-colors duration-150 hover:text-text-primary';

export default function Footer() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { open: openContribute } = useContributeModal();

  function handleContribute() {
    if (isAuthenticated) {
      navigate('/contribute');
    } else {
      openContribute();
    }
  }

  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto max-w-container px-4 py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2">
              <span aria-hidden="true">☕</span>
              <span className="font-display text-heading-3 text-text-primary">JavaCup</span>
            </Link>
            <p className="mt-3 text-body-md text-text-secondary">
              Clarity for the Java journey. Community-validated guidance, free forever.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex gap-16">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <div className="font-mono text-mono-label text-text-muted">// {col.heading.toLowerCase()}</div>
                <ul className="mt-3 flex flex-col gap-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <span className="relative inline-block">
                        {l.contribute ? (
                          <button type="button" onClick={handleContribute} className={linkClass}>
                            {l.label}
                          </button>
                        ) : (
                          <Link to={l.to} className={linkClass}>
                            {l.label}
                          </Link>
                        )}
                        {l.badge ? (
                          <span
                            className="pointer-events-none absolute -top-2.5 -right-7 animate-badge-pulse font-mono text-[9px] font-medium tracking-wide text-success-bright"
                            aria-hidden="true"
                          >
                            {l.badge}
                          </span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* External */}
            <div>
              <div className="font-mono text-mono-label text-text-muted">// open source</div>
              <ul className="mt-3 flex flex-col gap-2">
                <li>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 text-body-md text-text-secondary transition-colors duration-150 hover:text-text-primary"
                  >
                    GitHub
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                      <path d="M7 17 17 7M7 7h10v10" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border-subtle pt-6 sm:flex-row">
          <span className="text-body-sm text-text-muted">
            JavaCup — clarity for the Java journey.
          </span>
          <span className="font-mono text-mono-label text-text-muted">// built in the open</span>
        </div>
      </div>
    </footer>
  );
}
