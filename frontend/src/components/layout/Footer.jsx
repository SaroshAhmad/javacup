import { Link } from 'react-router';

/**
 * Footer — navigation + trust signals (Brand Identity v2.0, §7.4 / S8).
 * Logo + tagline, organised link columns, community guidelines, GitHub.
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
      { label: 'Contribute', to: '/contribute' },
      { label: 'Guidelines', to: '/guidelines' },
    ],
  },
];

const GITHUB_URL = 'https://github.com/SaroshAhmad/javacup';

export default function Footer() {
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
                      <Link
                        to={l.to}
                        className="text-body-md text-text-secondary transition-colors duration-150 hover:text-text-primary"
                      >
                        {l.label}
                      </Link>
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
