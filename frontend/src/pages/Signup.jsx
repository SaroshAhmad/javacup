import { useState } from 'react';
import { Link } from 'react-router';
import Button from '../components/ui/Button';
import { Field, Input } from '../components/ui/Field';
import AuthShell from '../components/auth/AuthShell';
import { supabase } from '../lib/supabase';

/**
 * Signup (/signup) — create an account with email + password, or Google OAuth.
 *
 * Wired to Supabase (Phase B). On submit we call supabase.auth.signUp; with email
 * confirmation ON (the Supabase default and what the architecture doc specifies), the
 * user must click a link in their inbox before they can log in — so success shows a
 * "check your email" state rather than logging them straight in.
 *
 * Background-tag selection happens AFTER confirmation, in onboarding (Phase D) — kept
 * off this form so signup stays frictionless. The name is stored in user metadata now
 * and mirrored into the profiles row later.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

function validate(data) {
  const errors = {};
  if (!data.name?.trim()) errors.name = 'Enter your name.';
  if (!data.email?.trim()) errors.email = 'Enter your email.';
  else if (!EMAIL_RE.test(data.email.trim())) errors.email = 'That doesn’t look like a valid email.';
  if (!data.password) errors.password = 'Choose a password.';
  else if (data.password.length < MIN_PASSWORD) errors.password = `At least ${MIN_PASSWORD} characters.`;
  return errors;
}

export default function Signup() {
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState(null);

  function clearError(name) {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      form.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }

    setPending(true);
    setErrors({});
    const email = data.email.trim();
    const { error } = await supabase.auth.signUp({
      email,
      password: data.password,
      options: { data: { name: data.name.trim() } },
    });
    setPending(false);

    if (error) {
      setErrors({ form: error.message });
      return;
    }
    setSentTo(email);
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) setErrors({ form: error.message });
  }

  // Success state — account created, confirmation email sent.
  if (sentTo) {
    return (
      <AuthShell
        eyebrow="// almost there"
        title="Check your email"
        subtitle={`We sent a confirmation link to ${sentTo}. Click it to activate your account, then log in.`}
        footer={
          <>
            Wrong address?{' '}
            <button type="button" onClick={() => setSentTo(null)} className="text-amber-400 transition-colors hover:text-amber-300">
              Try again
            </button>
          </>
        }
      >
        <p className="text-center text-body-sm text-text-secondary">
          Didn’t get it? Check your spam folder — it can take a minute to arrive.
        </p>
        <Button as={Link} to="/login" variant="secondary" className="mt-4 w-full">
          Go to log in
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="// join"
      title="Create your free account"
      subtitle="No credit card. No spam. Just a community that has your back."
      googleLabel="Sign up with Google"
      onGoogle={handleGoogle}
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-amber-400 transition-colors hover:text-amber-300">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Field label="Name" htmlFor="name" required error={errors.name}>
          <Input id="name" name="name" placeholder="Ada Lovelace"
            autoComplete="name" invalid={!!errors.name} onChange={() => clearError('name')} />
        </Field>

        <Field label="Email" htmlFor="email" required error={errors.email}>
          <Input id="email" name="email" type="email" placeholder="ada@example.com"
            autoComplete="email" invalid={!!errors.email} onChange={() => clearError('email')} />
        </Field>

        <Field label="Password" htmlFor="password" required error={errors.password}
          hint={errors.password ? undefined : 'At least 8 characters.'}>
          <Input id="password" name="password" type="password" placeholder="••••••••"
            autoComplete="new-password" invalid={!!errors.password} onChange={() => clearError('password')} />
        </Field>

        {errors.form ? (
          <p className="text-body-sm text-red-400" role="alert">{errors.form}</p>
        ) : null}

        <Button type="submit" variant="primary" className="mt-1" disabled={pending}>
          {pending ? 'Creating account…' : 'Create account'}
        </Button>

        <p className="text-center text-body-sm text-text-muted">
          By joining you agree to our{' '}
          <Link to="/guidelines" className="text-text-secondary underline hover:text-text-primary">
            community guidelines
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}
