/**
 * Guidelines (/guidelines) — Community Guidelines.
 *
 * Two jobs (per PRD): set JavaCup's tone, and state plainly what is and isn't acceptable.
 * Voice is "clear, firm, fair" per the Brand Identity. The three core rules — be honest,
 * be helpful, be specific — are the approved framing from the brand doc.
 *
 * This is content, not interaction: deliberately calm and readable, left-aligned prose.
 */

const CORE = [
  ['Be honest', 'Share what actually worked for you, and say when something didn’t. If you haven’t done it, don’t claim you have. Honest beats impressive.'],
  ['Be helpful', 'Answer the question that was asked. Point people to what helped you. Lifting someone up costs nothing and is the entire point of this place.'],
  ['Be specific', 'Vague advice helps no one. “Build projects” is weak; “build a REST API with Spring Boot and Postgres, here’s why” is gold. Specifics are the currency here.'],
];

const EXPECT = [
  ['No question is too basic', 'Everyone started somewhere. If someone asks something you find obvious, answer kindly or scroll past — never mock. Gatekeeping is the one thing this community does not tolerate.'],
  ['Respect the journey, not the credential', 'A career switcher’s hard-won advice is as valuable as a senior engineer’s. Judge contributions by whether they help, not by who wrote them.'],
  ['Disagree with the idea, never the person', 'Push back on advice you think is wrong — that’s healthy, and the votes exist for exactly this. But keep it about the content. No insults, no condescension.'],
  ['Give credit and keep it free', 'Link to original sources. Don’t pass off others’ work as your own. JavaCup’s resources are free — don’t use it to funnel people to paywalls or pitches.'],
];

const NOT_ALLOWED = [
  'Harassment, hate speech, or personal attacks of any kind',
  'Spam, self-promotion, affiliate links, or advertising',
  'Misinformation presented as fact, or deliberately bad advice',
  'Plagiarism — posting others’ content or code as your own',
  'Off-topic content unrelated to learning Java or building a career in it',
  'Anything illegal, or sharing pirated courses, books, or paid material',
];

export default function Guidelines() {
  return (
    <div className="mx-auto max-w-prose px-4 py-16">
      <div className="font-mono text-mono-label text-text-muted">// community guidelines</div>
      <h1 className="mt-3 font-display text-heading-1 text-text-primary">
        How we treat each other here.
      </h1>
      <p className="mt-4 text-body-lg text-text-secondary">
        JavaCup only works because people share honestly and help each other. These
        guidelines keep it that way. They’re short on purpose.
      </p>

      {/* The three rules — the heart of it */}
      <div className="mt-10 rounded-xl border border-border-subtle bg-surface p-6">
        <p className="text-body-lg text-text-primary">
          No question is too basic here. The only rules are:{' '}
          <span className="text-amber-400">be honest, be helpful, be specific.</span>
        </p>
        <div className="mt-6 flex flex-col gap-5">
          {CORE.map(([title, body]) => (
            <div key={title} className="border-l-2 border-amber-700/40 pl-4">
              <div className="font-display text-heading-3 text-text-primary">{title}</div>
              <p className="mt-1 text-body-md text-text-secondary">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What we expect */}
      <h2 className="mt-12 font-display text-heading-2 text-text-primary">What we expect</h2>
      <div className="mt-5 flex flex-col gap-5">
        {EXPECT.map(([title, body]) => (
          <div key={title}>
            <div className="font-display text-heading-3 text-text-primary">{title}</div>
            <p className="mt-1 text-body-md text-text-secondary">{body}</p>
          </div>
        ))}
      </div>

      {/* What's not allowed */}
      <h2 className="mt-12 font-display text-heading-2 text-text-primary">What’s not allowed</h2>
      <p className="mt-3 text-body-md text-text-secondary">
        Do any of these and your content may be removed and your account suspended. We’d
        rather not — but a community is only as safe as the line it’s willing to hold.
      </p>
      <ul className="mt-5 flex flex-col gap-3">
        {NOT_ALLOWED.map((item) => (
          <li key={item} className="flex gap-3 text-body-md text-text-secondary">
            <span className="mt-0.5 shrink-0 text-red-400" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <circle cx="12" cy="12" r="9" /><path d="m15 9-6 6M9 9l6 6" />
              </svg>
            </span>
            {item}
          </li>
        ))}
      </ul>

      {/* How moderation works */}
      <h2 className="mt-12 font-display text-heading-2 text-text-primary">How this is enforced</h2>
      <p className="mt-3 text-body-md text-text-secondary">
        Anyone can report a post or reply that crosses a line. Reports go to the team for
        review. Most issues end with a quiet removal and a note; repeated or serious
        breaches end the account. We aim to be fair, and to explain decisions when asked.
      </p>
      <p className="mt-3 text-body-md text-text-secondary">
        These guidelines will grow as the community does. If something here is unclear or
        feels wrong, tell us — this is your community as much as anyone’s.
      </p>

      <p className="mt-10 font-mono text-mono-label text-text-muted">
        // be honest · be helpful · be specific
      </p>
    </div>
  );
}
