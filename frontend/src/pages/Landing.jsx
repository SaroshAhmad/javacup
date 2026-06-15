import { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';

/**
 * Landing (/) — the front door.
 *
 * S1 Hero · S2 Problem · S3 How it works · S4 Who it's for ·
 * S5 Roadmap preview · S6 Community · S7 Closing CTA.
 *
 * Interactive only where it earns it (S3 hover, S4 select, S5 expand); calm elsewhere.
 * Copy is locked per the Landing Copy Deck.
 */

// --- small inline icons (no icon-font dependency) ---
const HowIcon = {
  map: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true">
      <path d="M9 6 3 4v14l6 2 6-2 6 2V6l-6-2-6 2Z" /><path d="M9 4v14M15 6v14" />
    </svg>
  ),
  vote: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true">
      <path d="m18 15-6-6-6 6" /><path d="m18 9-6-6-6 6" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  ),
};

const HOW = [
  ['map', 'Follow the roadmap', 'Five stages, first line of code to job-ready. Every topic marked essential, recommended, or optional — so you know what to skip.'],
  ['vote', 'Trust the votes', 'The community shares honest advice; the best rises to the top — ranked by people who got hired, not view counts or ads.'],
  ['chat', 'Learn out loud', 'Ask, share, and see how career switchers, self-taught devs and grads actually did it. Their background sits on every post.'],
];

const WHO = [
  ['career_switcher', 'switcher', 'Coming from another career, teaching yourself Java around a full-time job. You need the shortest honest path, not a four-year syllabus.'],
  ['self_taught', 'self', 'No formal CS background, learning from the internet. JavaCup tells you which parts of the internet are worth your time.'],
  ['cs_graduate', 'grad', 'You have the theory but not the job. Learn what university skipped: Spring, real projects, and what interviews actually test.'],
  ['student', 'student', 'Still studying, building skills early. Get ahead with a clear path and a community that has been where you are going.'],
];

const STAGES = [
  ['1', 'Foundations', 'Syntax, variables, control flow, your first program.'],
  ['2', 'Core Java', 'OOP, collections, generics, exceptions, streams.'],
  ['3', 'Frameworks & Spring', 'Spring Boot, REST APIs, dependency injection.'],
  ['4', 'Building Real Projects', 'Databases, testing, putting a full app together.'],
  ['5', 'Employment Ready', 'Interview prep, portfolio, the job hunt.'],
];

const QUOTES = [
  ['switcher', 142, '“Skip the 40-hour video courses. Build three small projects instead. You learn more shipping than watching.”'],
  ['grad', 98, '“A CS degree doesn’t mean you can skip Spring — that’s where I struggled most in interviews.”'],
  ['pro', 76, '“After 8 years hiring Java devs: I care why you chose ArrayList over LinkedList, not whether you memorised every method.”'],
];

function SectionLabel({ children, accent = false }) {
  return (
    <div className={'text-center font-mono text-mono-label ' + (accent ? 'text-amber-400' : 'text-text-muted')}>
      {children}
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [whoSelected, setWhoSelected] = useState(null);
  const [openStage, setOpenStage] = useState(null);

  return (
    <div className="mx-auto max-w-container px-4 py-16">
      {/* S1 — Hero */}
      <section className="relative overflow-hidden rounded-xl border border-border-subtle bg-base">
        <div className="pointer-events-none absolute inset-0 bg-dot-grid mask-fade-b" />
        <div className="absolute inset-x-0 top-0 h-px accent-line" />
        <div className="relative px-6 py-16 text-center sm:px-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border-strong bg-raised px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="font-mono text-mono-label text-text-secondary">community-validated · free forever</span>
          </div>
          <h1 className="font-display text-display text-text-primary">
            Your Java journey.
            <br />
            Finally, a <span className="text-amber-400">clear path.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-hero text-body-lg text-text-secondary">
            Community-validated roadmaps, honest advice, and the resources that actually matter — all in one place. Free forever.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button variant="primary" onClick={() => navigate('/login')}>Join for free</Button>
            <Button variant="secondary" onClick={() => navigate('/roadmap')}>Explore the roadmap →</Button>
          </div>
        </div>
        <div className="relative grid grid-cols-3 border-t border-border-subtle">
          {[['5', 'stages'], ['120+', 'resources'], ['2,400+', 'votes cast']].map(([v, l], i) => (
            <div key={l} className={'px-4 py-5 text-center' + (i < 2 ? ' border-r border-border-subtle' : '')}>
              <div className="font-mono text-2xl font-medium text-text-primary">{v}</div>
              <div className="mt-1 text-body-sm text-text-muted">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* S2 — Problem (calm) */}
      <section className="mt-20 text-center">
        <SectionLabel>// the problem</SectionLabel>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-heading-2 text-text-primary">
          Learning Java alone is overwhelming — not because there’s too little, but{' '}
          <span className="text-amber-400">too much.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-body-lg text-text-secondary">
          There are a million Java tutorials, courses, and playlists. That’s exactly the problem. You don’t know which are worth your time, what order to learn things in, or what matters for getting hired — so you bounce between resources and half-finish three courses.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-body-lg text-text-primary">You’re not behind. You’re just missing a map.</p>
      </section>

      {/* S3 — How it works (hover) */}
      <section className="mt-20 text-center">
        <SectionLabel>// how it works</SectionLabel>
        <h2 className="mt-3 font-display text-heading-2 text-text-primary">A clear path, validated by people who’ve walked it.</h2>
        <p className="mx-auto mt-2 max-w-xl text-body-md text-text-secondary">Not another pile of content. JavaCup turns lived experience into trusted, ranked guidance.</p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {HOW.map(([icon, title, body], i) => (
            <Card
              key={title}
              className={'text-center transition-colors duration-150 ' + (hovered === i ? 'border-amber-400' : '')}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="mx-auto mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-amber-700/40 bg-amber-surface text-amber-400">
                {HowIcon[icon]}
              </div>
              <h3 className="font-display text-heading-3 text-text-primary">{title}</h3>
              <p className="mt-1 text-body-md text-text-secondary">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* S4 — Who it's for (select) */}
      <section className="mt-20 text-center">
        <SectionLabel>// who it’s for</SectionLabel>
        <h2 className="mt-3 font-display text-heading-2 text-text-primary">Built for everyone learning Java the hard way.</h2>
        <p className="mt-2 text-body-md text-text-secondary">
          Which one are you? <span className="text-text-muted">(tap to see your path)</span>
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {WHO.map(([label, tone]) => {
            const active = whoSelected === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setWhoSelected(label)}
                className={
                  'rounded-lg border bg-surface p-4 text-center transition-colors duration-150 ' +
                  (active ? 'border-amber-400 bg-raised' : 'border-border-subtle hover:border-border-strong')
                }
              >
                <Tag tone={tone} label={label} />
              </button>
            );
          })}
        </div>
        <div className="mt-3.5 rounded-lg border border-border-subtle bg-surface px-4 py-3.5 text-center text-body-md text-text-secondary">
          {whoSelected
            ? WHO.find(([l]) => l === whoSelected)[2]
            : 'Tap a card above to see how JavaCup fits your situation.'}
        </div>
      </section>

      {/* S5 — Roadmap preview (expand) */}
      <section className="relative mt-20 overflow-hidden rounded-xl border border-border-subtle bg-base px-6 py-12 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-dot-grid mask-fade-b" />
        <div className="relative text-center">
          <SectionLabel accent>// the roadmap</SectionLabel>
          <h2 className="mt-3 font-display text-heading-2 text-text-primary">Five stages. First line of code to job-ready.</h2>
          <p className="mt-2 text-body-md text-text-secondary">
            Browse the whole thing — free, no login. <span className="text-text-muted">Tap a stage to expand.</span>
          </p>
          <div className="mx-auto mt-6 flex max-w-prose flex-col gap-2 text-left">
            {STAGES.map(([num, title, sub], i) => {
              const open = openStage === i;
              const last = i === STAGES.length - 1;
              return (
                <button
                  key={title}
                  type="button"
                  onClick={() => setOpenStage(open ? null : i)}
                  className={
                    'rounded-lg border bg-surface px-4 py-3.5 text-left transition-colors duration-150 ' +
                    (open ? 'border-amber-400' : 'border-border-subtle hover:border-border-strong')
                  }
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        'inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-body-sm font-medium ' +
                        (last ? 'bg-amber-surface text-amber-400' : 'bg-amber-surface text-amber-400')
                      }
                    >
                      {num}
                    </span>
                    <span className="flex-1 text-body-lg font-medium text-text-primary">{title}</span>
                    <span className={'text-text-muted transition-transform duration-200 ' + (open ? 'rotate-180' : '')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </div>
                  {open ? <div className="mt-2 pl-10 text-body-md text-text-secondary">{sub}</div> : null}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* S6 — Community (calm) */}
      <section className="mt-20 text-center">
        <SectionLabel>// what the community says</SectionLabel>
        <h2 className="mt-3 font-display text-heading-2 text-text-primary">Real guidance, ranked by people who walked the path.</h2>
        <div className="mx-auto mt-6 flex max-w-prose flex-col gap-2.5 text-left">
          {QUOTES.map(([tone, votes, text]) => (
            <Card key={votes} className="flex gap-4">
              <div className="min-w-11 text-center">
                <div className="text-success-bright">▲</div>
                <div className="font-mono text-lg font-medium text-text-primary">{votes}</div>
              </div>
              <div>
                <Tag tone={tone} />
                <p className="mt-2 text-body-md text-text-secondary">{text}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* S7 — Closing CTA */}
      <section className="mt-20 rounded-xl border border-border-subtle bg-surface px-6 py-12 text-center">
        <h2 className="font-display text-heading-2 text-text-primary">Start your Java path today.</h2>
        <p className="mt-2 text-body-md text-text-secondary">No credit card. No spam. Free forever.</p>
        <div className="mt-6 flex justify-center">
          <Button variant="primary" onClick={() => navigate('/login')}>Join for free</Button>
        </div>
      </section>
    </div>
  );
}
