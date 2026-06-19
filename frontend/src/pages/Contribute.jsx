import { Link } from 'react-router';
import Button from '../components/ui/Button';

/**
 * Contribute (/contribute) — the deep, content-rich pitch for the contributor program.
 *
 * Reframes JavaCup as a 56-day engineering cohort ("a playground, not a resource site").
 * This is the long-form page; the short conversion modal (ContributeModal) is the quick
 * nudge that points here / to signup.
 *
 * HONESTY: the cohort is the VISION, not a running program. All copy frames it as
 * "forming / be early / building toward" — never implies a finished cohort exists today.
 *
 * Phase B: when auth lands, logged-in users will see a contribution-intent form here
 * (areas, skills, availability) instead of the signup CTAs. That form is intentionally
 * NOT built yet — it needs real auth state to gate it to members.
 */

const STAGES = [
  ['days 1–3', 'Team forms', 'Ten engineers matched into a squad — or bring your own clan. Meet, set norms, get aligned.', 'start'],
  ['days 4–10', 'Scope & plan', 'A real project brief. You break it down, plan sprints, and divide ownership like a startup.', null],
  ['days 11–24', 'Build — foundations', 'First features land. Architecture, APIs, components — production code, not throwaway toys.', null],
  ['days 25–38', 'Build — the hard parts', 'Real engineering: edge cases, code review, refactors — the problems tutorials quietly skip.', null],
  ['days 39–48', 'Polish & test', 'Harden it. Tests, bug-bashing, performance, and making the whole thing genuinely usable.', null],
  ['days 49–55', 'Ship to production', 'Deploy live. Real users, real feedback. Your name on something that actually exists.', null],
  ['day 56', 'Demo & reflect', 'Show what you built. Walk away with a portfolio piece — and a team that sticks around.', 'end'],
];

const REWARDS = [
  ['01', 'text-[#E0A93C]', 'Unparalleled experience', 'The full build-to-ship loop — not isolated tickets in a vacuum.', false],
  ['02', 'text-[#34D399]', 'A real team', 'Collaborate, review, and grow alongside nine other engineers.', false],
  ['03', 'text-[#A78BFA]', 'Startup mindset', 'Ownership, speed, and shipping under real constraints.', false],
  ['04', 'text-[#7C93F0]', 'Give back to Java', 'Help the next wave of learners find their way. It feels good.', false],
  ['05', 'text-[#4FD1C5]', 'A portfolio that stands out', 'A live, shipped product with your name on it — the one thing most juniors can never show.', true],
];

const STACK = ['React', 'Spring Boot', 'PostgreSQL', 'Docker', 'CI/CD'];

function Eyebrow({ children, accent }) {
  return (
    <div className={`text-center font-mono text-mono-label ${accent ? 'text-amber-400' : 'text-text-muted'}`}>
      {children}
    </div>
  );
}

export default function Contribute() {
  return (
    <div className="bg-base">
      {/* 1 — Hero */}
      <section className="relative overflow-hidden border-b border-border-subtle">
        <div className="pointer-events-none absolute inset-0 bg-dot-grid mask-fade-b" />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-700/40 bg-amber-surface px-3 py-1.5">
            <span className="h-1.5 w-1.5 animate-badge-pulse rounded-full bg-success-bright" />
            <span className="font-mono text-mono-label text-amber-400">the vision · cohorts forming</span>
          </div>
          <h1 className="font-display text-display text-text-primary">
            A 56-day engineering playground —{' '}
            <span className="text-amber-400">not a resource site.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-body-lg text-text-secondary">
            JavaCup is building something most learners never get: a real team, a real product, and
            56 days to ship something that matters. Join alone, or bring your clan.
          </p>
          <div className="mt-8">
            <Button as={Link} to="/signup" variant="primary" size="lg">
              Join the first cohort
            </Button>
          </div>
        </div>
      </section>

      {/* 2 — The reframe */}
      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <Eyebrow>// the real thing</Eyebrow>
          <h2 className="mt-3 font-display text-heading-1 text-text-primary">
            Most developers practice. Here, you build.
          </h2>
          <p className="mt-4 text-body-lg text-text-secondary">
            Tutorials teach syntax. Even a junior job often means closing isolated tickets without
            ever seeing the whole product. JavaCup is different: you design features, write
            production code, review each other’s work, and watch a platform grow from the ground up
            — the full engineering experience, compressed into 56 focused days.
          </p>
        </div>
      </section>

      {/* 3 — The 56-day timeline (centerpiece) */}
      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-2xl px-4 py-20">
          <Eyebrow accent>// the 56-day journey</Eyebrow>
          <h2 className="mt-3 text-center font-display text-heading-1 text-text-primary">
            Seven stages, one shipped product.
          </h2>

          <ol className="relative mt-12 ml-3 border-l border-border-strong">
            {STAGES.map(([days, title, desc, mark]) => (
              <li key={title} className="relative ml-8 pb-9 last:pb-0">
                <span
                  className={
                    'absolute -left-[42px] flex h-5 w-5 items-center justify-center rounded-full ' +
                    (mark === 'start'
                      ? 'border-2 border-amber-400 bg-amber-surface'
                      : mark === 'end'
                        ? 'border-2 border-success-bright bg-[#0E2620]'
                        : 'border-2 border-border-strong bg-raised')
                  }
                >
                  {mark === 'start' ? <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> : null}
                  {mark === 'end' ? <span className="h-1.5 w-1.5 rounded-full bg-success-bright" /> : null}
                </span>
                <div
                  className={
                    'font-mono text-mono-label ' +
                    (mark === 'start' ? 'text-amber-400' : mark === 'end' ? 'text-success-bright' : 'text-text-muted')
                  }
                >
                  {days}
                </div>
                <h3 className="mt-1 font-display text-heading-3 text-text-primary">{title}</h3>
                <p className="mt-1 text-body-md text-text-secondary">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4 — What you walk away with */}
      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <Eyebrow>// what you walk away with</Eyebrow>
          <h2 className="mt-3 text-center font-display text-heading-1 text-text-primary">
            Five things tutorials can’t give you.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {REWARDS.map(([num, color, title, desc, wide]) => (
              <div
                key={num}
                className={
                  'rounded-xl border border-border-subtle bg-surface p-5 ' +
                  (wide ? 'sm:col-span-2' : '')
                }
              >
                <div className={`font-mono text-body-sm font-medium ${color}`}>{num}</div>
                <h3 className="mt-2 font-display text-heading-3 text-text-primary">{title}</h3>
                <p className="mt-1 text-body-md text-text-secondary">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — How it's built */}
      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <Eyebrow>// how it’s built</Eyebrow>
          <h2 className="mt-3 font-display text-heading-1 text-text-primary">
            Modern stack. Real infrastructure.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-body-md text-text-secondary">
            React, Spring Boot, PostgreSQL, Docker, CI/CD — the tools real teams ship with. We
            provide the infrastructure, the project scope, and the support. You bring the energy.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {STACK.map((t) => (
              <span
                key={t}
                className="rounded-md border border-border-subtle bg-surface px-3 py-1.5 font-mono text-body-sm text-text-secondary"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-md text-body-sm italic text-text-muted">
            And it’s only the beginning — JavaCup is growing toward something much bigger. The
            earliest cohorts help shape what it becomes.
          </p>
        </div>
      </section>

      {/* 6 — Join alone or bring your clan */}
      <section>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h2 className="font-display text-heading-1 text-text-primary">
            Join alone, or bring your clan.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-body-lg text-text-secondary">
            The first cohorts are forming now. Be early — the people who join first shape what
            JavaCup becomes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button as={Link} to="/signup" variant="primary" size="lg">
              Join the first cohort
            </Button>
            <Button as={Link} to="/signup" variant="secondary" size="lg">
              Bring my team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
