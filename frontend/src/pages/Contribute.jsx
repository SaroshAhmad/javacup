import { useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Field, Input, Textarea, Select } from '../components/ui/Field';

/**
 * Contribute (/contribute) — aspirational "join the build" page.
 *
 * Custom-UI form with client-side validation, POSTing to Web3Forms (no backend of our
 * own): Web3Forms stores the submission, emails it, and runs spam protection.
 *
 * SETUP: replace WEB3FORMS_ACCESS_KEY with the key from web3forms.com.
 */
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY_HERE';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

const icons = {
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="m8 9-3 3 3 3" /><path d="m16 9 3 3-3 3" /><path d="m14 7-4 10" />
    </svg>
  ),
  pr: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><path d="M6 8.5v7" />
      <circle cx="18" cy="18" r="2.5" /><path d="M18 15.5V11a4 4 0 0 0-4-4h-2.5" /><path d="m13 4-2 3 2 3" />
    </svg>
  ),
  mentor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  ),
  rocket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
};

const perks = [
  ['code', 'Real production code', 'Work on a live React + Spring Boot + Postgres app, not another tutorial to-do list.'],
  ['pr', 'Portfolio-ready', 'Merged PRs on a real open-source project you can show employers.'],
  ['mentor', 'Mentorship', 'Code review and guidance from someone building in public, learning alongside you.'],
  ['rocket', 'Ship things that matter', 'Help thousands of Java learners find a clear path. Your work goes live.'],
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validate the raw form values; return a map of field -> error message. */
function validate(data) {
  const errors = {};
  if (!data.name?.trim()) errors.name = 'Please enter your name.';
  if (!data.email?.trim()) errors.email = 'Please enter your email.';
  else if (!EMAIL_RE.test(data.email.trim())) errors.email = 'That doesn\u2019t look like a valid email.';
  if (!data.focus) errors.focus = 'Pick what you\u2019d like to work on.';
  return errors;
}

export default function Contribute() {
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

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
      // focus the first invalid field for keyboard/screen-reader users
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

  /** Clear a field's error as the user corrects it. */
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
      {/* Vision header */}
      <div className="mx-auto max-w-prose text-center">
        <div className="mb-3 font-mono text-mono-label text-text-muted">// join the build</div>
        <h1 className="font-display text-heading-1 text-text-primary">
          Build something real. <span className="text-amber-400">Learn by shipping.</span>
        </h1>
        <p className="mt-4 text-body-lg text-text-secondary">
          JavaCup is being built in the open. If you&rsquo;re learning full-stack development
          and want real experience instead of another tutorial, contribute to a live
          project &mdash; React, Spring Boot, PostgreSQL &mdash; and ship work you can
          actually show.
        </p>
      </div>

      {/* Perks */}
      <div className="mx-auto mt-12 grid max-w-prose grid-cols-1 gap-4 sm:grid-cols-2">
        {perks.map(([icon, title, body]) => (
          <Card key={title}>
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-amber-700/40 bg-amber-surface text-amber-400">
              {icons[icon]}
            </div>
            <h3 className="font-display text-heading-3 text-text-primary">{title}</h3>
            <p className="mt-1 text-body-md text-text-secondary">{body}</p>
          </Card>
        ))}
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
            <h2 className="font-display text-heading-3 text-text-primary">You&rsquo;re on the list.</h2>
            <p className="mt-2 text-body-md text-text-secondary">
              Thanks for wanting to build JavaCup. I&rsquo;ll be in touch about how to get started.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="mb-1">
              <h2 className="font-display text-heading-3 text-text-primary">Want in?</h2>
              <p className="text-body-md text-text-secondary">
                Tell me a little about you. No commitment &mdash; just a conversation.
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
