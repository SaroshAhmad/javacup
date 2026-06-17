import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Button from '../components/ui/Button';
import { Field, Input } from '../components/ui/Field';
import AuthShell from '../components/auth/AuthShell';
import { supabase } from '../lib/supabase';

/**
 * Login (/login) — email + password sign-in, plus Google OAuth.
 *
 * Wired to Supabase (Phase B). On success we navigate home; the AuthProvider is
 * subscribed to auth changes, so the navbar and the rest of the app update to the
 * logged-in state automatically — no manual state passing needed here.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data) {
  const errors = {};
  if (!data.email?.trim()) errors.email = 'Enter your email.';
  else if (!EMAIL_RE.test(data.email.trim())) errors.email = 'That doesn’t look like a valid email.';
  if (!data.password) errors.password = 'Enter your password.';
  return errors;
}

export default function Login() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

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
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email.trim(),
      password: data.password,
    });
    setPending(false);

    if (error) {
      // Supabase returns "Invalid login credentials" for both wrong-password and
      // unconfirmed-email — keep the message generic, don't leak which.
      setErrors({ form: error.message });
      return;
    }
    navigate('/');
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) setErrors({ form: error.message });
  }

  return (
    <AuthShell
      eyebrow="// welcome back"
      title="Log in to JavaCup"
      subtitle="Pick up where you left off — your roadmap, votes, and posts are waiting."
      googleLabel="Continue with Google"
      onGoogle={handleGoogle}
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="text-amber-400 transition-colors hover:text-amber-300">
            Create a free account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Field label="Email" htmlFor="email" required error={errors.email}>
          <Input id="email" name="email" type="email" placeholder="ada@example.com"
            autoComplete="email" invalid={!!errors.email} onChange={() => clearError('email')} />
        </Field>

        <Field label="Password" htmlFor="password" required error={errors.password}>
          <Input id="password" name="password" type="password" placeholder="••••••••"
            autoComplete="current-password" invalid={!!errors.password} onChange={() => clearError('password')} />
        </Field>

        {errors.form ? (
          <p className="text-body-sm text-red-400" role="alert">{errors.form}</p>
        ) : null}

        <Button type="submit" variant="primary" className="mt-1" disabled={pending}>
          {pending ? 'Signing in…' : 'Log in'}
        </Button>
      </form>
    </AuthShell>
  );
}
