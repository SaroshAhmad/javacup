import { useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Field, Input, Textarea, Select } from '../components/ui/Field';

/**
 * Contribute (/contribute) — "join the build" page.
 *
 * Two-way pitch: what a contributor GAINS (escape tutorial hell, real production
 * experience, modern stack, portfolio, recognition) as well as what they give.
 *
 * Sections:
 *   1. Hero — reframed around the contributor's gain
 *   2. Why contribute — six expanding cards (tap/click to reveal full detail)
 *   3. The stack — explicit, employable tech shown as tokens
 *   4. Form — custom UI, client-side validation, POSTs to Web3Forms (unchanged)
 *
 * SETUP: replace WEB3FORMS_ACCESS_KEY with the key from web3forms.com.
 */
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY_HERE';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/* ------------------------------------------------------------------ *
 * Reasons to contribute — six expanding cards.
 * Each icon uses a distinct, muted hue from the brand palette (no repeats,
 * no red). chip = icon background, ring = icon border, fg = icon colour.
 * ------------------------------------------------------------------ */
const REASONS = [
  {
    key: 'code',
    color: { chip: 'bg-[#1E1809]', ring: 'border-[#3A2F16]', fg: 'text-[#E0A93C]' },
    title: 'Real production code',
    hook: 'Not another tutorial to-do list.',
    body: 'You’ll work inside a live React + Spring Boot + PostgreSQL codebase that thousands of learners actually use — with real constraints, real edge cases, and real users who notice when something breaks. This is the experience employers mean when they say “must have worked on production systems.” A todo app can’t give you that. A live platform can.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="m8 9-3 3 3 3" /><path d="m16 9 3 3-3 3" /><path d="m14 7-4 10" />
      </svg>
    ),
  },
  {
    key: 'stack',
    color: { chip: 'bg-[#0E2620]', ring: 'border-[#16403A]', fg: 'text-[#34D399]' },
    title: 'A modern, employable stack',
    hook: 'The tools real teams hire for.',
    body: 'React, Spring Boot, PostgreSQL, Supabase auth, Docker, CI/CD on every push. You won’t just read about these — you’ll use them together the way an actual engineering team does. Learning one tool in isolation is easy; wiring them into one working system is the skill that gets you hired. That’s the part tutorials skip and this gives you.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="m12 2 9 4.5-9 4.5-9-4.5L12 2Z" /><path d="m3 12 9 4.5 9-4.5" /><path d="m3 17 9 4.5 9-4.5" />
      </svg>
    ),
  },
  {
    key: 'portfolio',
    color: { chip: 'bg-[#1E1633]', ring: 'border-[#2E2350]', fg: 'text-[#A78BFA]' },
    title: 'A portfolio that proves itself',
    hook: 'Merged PRs, not screenshots.',
    body: 'Every contribution is a public, permanent record: a real pull request, reviewed and merged into a real product, with your name on it. When an interviewer asks “what have you built?”, you send a link to live code running in production — not a screenshot of a course certificate. That’s the single most convincing thing a junior developer can show, and most don’t have it.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><path d="M6 8.5v7" />
        <circle cx="18" cy="18" r="2.5" /><path d="M18 15.5V11a4 4 0 0 0-4-4h-2.5" /><path d="m13 4-2 3 2 3" />
      </svg>
    ),
  },
  {
    key: 'system',
    color: { chip: 'bg-[#11162E]', ring: 'border-[#232C50]', fg: 'text-[#7C93F0]' },
    title: 'Whole-system experience',
    hook: 'Architecture, DevOps, the full picture.',
    body: 'There’s far more here than writing components. Database design, API contracts, authentication, deployment pipelines, performance, system architecture — and a roadmap of features that’ll keep growing for years. You can go deep on the part you love or stretch into areas you’ve never touched. Few junior developers ever see a whole system end to end. Here, that’s the default.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" /><path d="M6 16V8a4 4 0 0 1 4-4h4" /><path d="m13 1 3 3-3 3" />
      </svg>
    ),
  },
  {
    key: 'review',
    color: { chip: 'bg-[#0C2526]', ring: 'border-[#154043]', fg: 'text-[#4FD1C5]' },
    title: 'Real code review',
    hook: 'Feedback that makes you better.',
    body: 'Your code gets read, questioned, and improved — the way it would on a real team. You’ll learn why one approach beats another, how to write code others can maintain, and how to take feedback without taking it personally. This is built in the open alongside other learners, so you’re never doing it alone. Honest review is the fastest way to level up, and it’s exactly what solo tutorial-watching can never give you.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M19 8v6M22 11h-6" />
      </svg>
    ),
  },
  {
    key: 'recognition',
    color: { chip: 'bg-[#2A1A0E]', ring: 'border-[#4A2F19]', fg: 'text-[#F59E5B]' },
    title: 'Recognition for real work',
    hook: 'Contribution that counts for something.',
    soon: true,
    body: 'As JavaCup grows, contributors who ship meaningful work will be recognised for it — with profile badges that reflect what you’ve built, and verifiable certificates that state exactly what you contributed and when. We’re building this carefully so it actually means something to an employer, not a participation sticker. It’s not live yet — but early contributors are the ones it’ll matter most for.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <circle cx="12" cy="8" r="6" /><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" />
      </svg>
    ),
  },
];

const STACK = ['React', 'Spring Boot', 'Java 21', 'PostgreSQL', 'Supabase', 'Docker', 'CI/CD', 'Tailwind'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data) {
  const errors = {};
  if (!data.name?.trim()) errors.name = 'Please enter your name.';
  if (!data.email?.trim()) errors.email = 'Please enter your email.';
  else if (!EMAIL_RE.test(data.email.trim())) errors.email = 'That doesn’t look like a valid email.';
  if (!data.focus) errors.focus = 'Pick what you’d like to work on.';
  return errors;
}

/** One expanding reason card. Tap header to toggle; body animates open. */
function ReasonCard({ reason, open, onToggle }) {
  return (
    <Card
      as="button"
      onClick={onToggle}
      className={
        'w-full text-left transition-colors duration-200 ' +
        (open ? 'border-amber-400' : 'hover:border-border-strong')
      }
      aria-expanded={open}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`inline-flex h-9 w-9 items-center justify-center rounded-md border ${reason.color.chip} ${reason.color.ring} ${reason.color.fg}`}>
          {reason.icon}
        </div>
        <span className={'mt-1 text-text-muted transition-transform duration-300 ' + (open ? 'rotate-45' : '')} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </div>

      <h3 className="mt-3.5 flex flex-wrap items-center gap-2 font-display text-heading-3 text-text-primary">
        {reason.title}
        {reason.soon ? (
          <span className="rounded border border-border-strong bg-raised px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-text-muted">
            coming soon
          </span>
        ) : null}
      </h3>
      <p className="mt-1 text-body-md text-text-secondary">{reason.hook}</p>

      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="mt-3 text-body-md leading-relaxed text-text-secondary">{reason.body}</p>
        </div>
      </div>
    </Card>
  );
}

export default function Contribute() {
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [openKey, setOpenKey] = useState('code'); // first card open by default

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (data.botcheck) {
      setStatus('success'); // honeypot tripped — silently drop
      return;
    }

    const errors = validate(data);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      const first = form.querySelector(`[name="${Object.keys(errors)[0]}"]`);
      first?.focus();
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: 'New JavaCup contributor',
          from_name: 'JavaCup contribute form',
          name: data.name,
          email: data.email,
          github: data.github,
          focus: data.focus,
          message: data.message,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        setErrorMsg(json.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Could not reach the server. Check your connection and try again.');
    }
  }

  function clearError(name) {
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-container px-4 py-16">
      {/* Hero — reframed around the contributor's gain */}
      <div className="mx-auto max-w-prose text-center">
        <div className="mb-3 font-mono text-mono-label text-text-muted">// join the build</div>
        <h1 className="font-display text-heading-1 text-text-primary">
          Stop building todo apps no one runs. <span className="text-amber-400">Ship something real.</span>
        </h1>
        <p className="mt-4 text-body-lg text-text-secondary">
          You don’t escape tutorial hell by watching one more video — you escape it by
          shipping real code that real people use. JavaCup is built in the open, and
          contributing is how you get genuine production experience: a modern stack, code
          review, and work you can actually show.
        </p>
      </div>

      {/* Why contribute — six expanding cards */}
      <div className="mx-auto mt-14 max-w-prose">
        <div className="text-center">
          <div className="font-mono text-mono-label text-text-muted">// why contribute</div>
          <h2 className="mt-3 font-display text-heading-2 text-text-primary">What you actually get</h2>
          <p className="mt-2 text-body-md text-text-secondary">Tap any card to see the full picture.</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {REASONS.map((reason) => (
            <ReasonCard
              key={reason.key}
              reason={reason}
              open={openKey === reason.key}
              onToggle={() => setOpenKey((k) => (k === reason.key ? null : reason.key))}
            />
          ))}
        </div>
      </div>

      {/* The stack */}
      <div className="mx-auto mt-14 max-w-prose text-center">
        <div className="font-mono text-mono-label text-text-muted">// the stack you’ll work in</div>
        <h2 className="mt-3 font-display text-heading-2 text-text-primary">Real tools. The ones teams hire for.</h2>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-border-subtle bg-surface px-3 py-1.5 font-mono text-body-sm text-text-secondary"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Form */}
      <Card className="mx-auto mt-16 max-w-form" padding="lg">
        {status === 'success' ? (
          <div className="py-6 text-center">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-success-surface text-success-bright">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h2 className="font-display text-heading-3 text-text-primary">You’re on the list.</h2>
            <p className="mt-2 text-body-md text-text-secondary">
              Thanks for wanting to build JavaCup. I’ll be in touch about how to get started.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="mb-1">
              <h2 className="font-display text-heading-3 text-text-primary">Want in?</h2>
              <p className="text-body-md text-text-secondary">
                Tell me a little about you. No commitment — just a conversation.
              </p>
            </div>

            {/* Honeypot — off-screen, not tabbable */}
            <input
              type="text"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />

            <Field label="Name" htmlFor="name" required error={fieldErrors.name}>
              <Input id="name" name="name" placeholder="Ada Lovelace" autoComplete="name"
                invalid={!!fieldErrors.name} onChange={() => clearError('name')} />
            </Field>

            <Field label="Email" htmlFor="email" required error={fieldErrors.email}>
              <Input id="email" name="email" type="email" placeholder="ada@example.com" autoComplete="email"
                invalid={!!fieldErrors.email} onChange={() => clearError('email')} />
            </Field>

            <Field label="GitHub" htmlFor="github" hint="So I can see what you've worked on.">
              <Input id="github" name="github" placeholder="github.com/yourname" autoComplete="off" />
            </Field>

            <Field label="What do you want to work on?" htmlFor="focus" required error={fieldErrors.focus}>
              <Select id="focus" name="focus" defaultValue="" invalid={!!fieldErrors.focus}
                onChange={() => clearError('focus')}>
                <option value="" disabled>Choose one</option>
                <option value="frontend">Frontend (React)</option>
                <option value="backend">Backend (Spring Boot)</option>
                <option value="both">Both / full-stack</option>
                <option value="not-sure">Not sure yet</option>
              </Select>
            </Field>

            <Field label="Anything else?" htmlFor="message" hint="A line about where you are in your journey helps.">
              <Textarea id="message" name="message" rows={4} placeholder="I'm a career switcher about six months into Java…" />
            </Field>

            {status === 'error' ? (
              <p className="text-body-sm text-red-400" role="alert">{errorMsg}</p>
            ) : null}

            <Button type="submit" variant="primary" disabled={status === 'submitting'} className="mt-1">
              {status === 'submitting' ? 'Sending…' : 'Count me in'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
