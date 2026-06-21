import { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '../components/ui/Button';
import { useAuth } from '../context/useAuth';
import { apiFetch } from '../lib/api';
import { BACKGROUND_TAGS, tagByKey } from '../lib/onboarding';
import { consumeRedirect, DEFAULT_DESTINATION } from '../lib/postAuthRedirect';

/**
 * Onboarding (/onboarding) — the 3-step guide a new member completes once, right after
 * signup (PRD F-05). Steps: (1) choose background tag, (2) see a recommended starting
 * stage personalised to that tag, (3) a "you're all set" close.
 *
 * On completion it POSTs to /api/v1/users/onboarding (which creates the profile row),
 * refreshes the auth sync (so onboardingRequired flips to false app-wide), and routes to
 * the member's intended destination (a stored return-path, e.g. /contribute) or the roadmap. Step 3 is a welcome rather than "read a post" because community posts do
 * not exist yet — kept honest; swap in a real post when discussions ship.
 *
 * This screen assumes the user is authenticated; routing guards that (it is only reached
 * when onboardingRequired is true).
 */
const STEPS = ['Background', 'Your start', 'All set'];

function StepDots({ step }) {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden="true">
      {STEPS.map((_, i) => (
        <span
          key={i}
          className={
            'h-1.5 rounded-full transition-all ' +
            (i === step ? 'w-6 bg-amber-400' : i < step ? 'w-1.5 bg-amber-700' : 'w-1.5 bg-border-strong')
          }
        />
      ))}
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { refreshSync } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedKey, setSelectedKey] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const selected = tagByKey(selectedKey);

  async function finish() {
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch('/api/v1/users/onboarding', {
        method: 'POST',
        body: JSON.stringify({ backgroundTag: selectedKey }),
      });
      await refreshSync(); // onboardingRequired → false everywhere
      // Land where the member originally intended (e.g. /contribute) if that intent was
      // carried through signup; otherwise the default roadmap.
      const destination = consumeRedirect() || DEFAULT_DESTINATION;
      navigate(destination);
    } catch {
      setError('Something went wrong saving your profile. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-base text-text-primary">
      <div className="pointer-events-none absolute inset-0 bg-dot-grid mask-fade-b" />
      <div className="relative mx-auto flex min-h-screen max-w-form flex-col justify-center px-4 py-16">
        <div className="mb-8">
          <StepDots step={step} />
        </div>

        {/* Step 1 — choose background tag */}
        {step === 0 ? (
          <div>
            <div className="text-center">
              <div className="font-mono text-mono-label text-text-muted">// step 1 of 3</div>
              <h1 className="mt-2 font-display text-heading-1 text-text-primary">Which sounds like you?</h1>
              <p className="mx-auto mt-3 max-w-sm text-body-md text-text-secondary">
                This sets your starting point and shows next to your name — so advice always has context.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-2.5">
              {BACKGROUND_TAGS.map((t) => {
                const active = selectedKey === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setSelectedKey(t.key)}
                    className={
                      'flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ' +
                      (active ? 'border-amber-400 bg-surface' : 'border-border-subtle bg-surface hover:border-border-strong')
                    }
                  >
                    <span
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-body-md"
                      style={{ color: t.accent, backgroundColor: t.accentBg }}
                    >
                      {t.label.charAt(0)}
                    </span>
                    <span className="flex-1">
                      <span className="block text-body-md text-text-primary">{t.label}</span>
                      <span className="block text-body-sm text-text-secondary">{t.blurb}</span>
                    </span>
                    <span
                      className={
                        'h-4 w-4 shrink-0 rounded-full border-2 ' +
                        (active ? 'border-amber-400 bg-amber-400' : 'border-border-strong')
                      }
                    />
                  </button>
                );
              })}
            </div>

            <Button
              variant="primary"
              className="mt-6 w-full"
              disabled={!selectedKey}
              onClick={() => setStep(1)}
            >
              Continue
            </Button>
          </div>
        ) : null}

        {/* Step 2 — recommended starting stage (personalised) */}
        {step === 1 && selected ? (
          <div className="text-center">
            <div className="font-mono text-mono-label text-text-muted">// step 2 of 3</div>
            <h1 className="mt-2 font-display text-heading-1 text-text-primary">Start here.</h1>
            <p className="mx-auto mt-3 max-w-sm text-body-md text-text-secondary">
              Based on where you're coming from, here's the best place to jump in.
            </p>

            <div className="mt-8 rounded-2xl border border-border-subtle bg-surface p-6">
              <div className="font-mono text-mono-label text-amber-400">
                recommended stage · {selected.startStage} of 5
              </div>
              <div className="mt-2 font-display text-heading-2 text-text-primary">
                {selected.startStageName}
              </div>
              <p className="mt-3 text-body-md text-text-secondary">{selected.why}</p>
            </div>
            <p className="mt-4 text-body-sm text-text-muted">
              You can explore any stage anytime — this is just where we'd start.
            </p>

            <div className="mt-8 flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button variant="primary" className="flex-1" onClick={() => setStep(2)}>
                Continue
              </Button>
            </div>
          </div>
        ) : null}

        {/* Step 3 — all set */}
        {step === 2 && selected ? (
          <div className="text-center">
            <div className="font-mono text-mono-label text-text-muted">// step 3 of 3</div>
            <h1 className="mt-2 font-display text-heading-1 text-text-primary">You're in.</h1>
            <p className="mx-auto mt-3 max-w-sm text-body-md text-text-secondary">
              Your profile's ready. From here you can follow the roadmap, vote on what
              actually helped people, and add your own take as you go.
            </p>

            <div className="mt-8 rounded-2xl border border-border-subtle bg-surface p-6 text-left">
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full font-display text-body-lg"
                  style={{ color: selected.accent, backgroundColor: selected.accentBg }}
                >
                  {selected.label.charAt(0)}
                </span>
                <div>
                  <div className="text-body-md text-text-primary">{selected.label}</div>
                  <div className="text-body-sm text-text-secondary">
                    Starting at {selected.startStageName}
                  </div>
                </div>
              </div>
            </div>

            {error ? <p className="mt-4 text-body-sm text-red-400" role="alert">{error}</p> : null}

            <div className="mt-8 flex gap-3">
              <Button variant="secondary" className="flex-1" disabled={submitting} onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="primary" className="flex-1" disabled={submitting} onClick={finish}>
                {submitting ? 'Setting up…' : 'Start exploring'}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
