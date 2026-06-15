# ADR 0006 — Contributor recognition: certificates and badges

- **Status:** Accepted (deferred — post-launch, post-community)
- **Date:** 2026-06
- **Supersedes:** —
- **Related:** ADR 0005 (roadmap v2 vision), PRD MVP v2, Brand Identity v2.0

---

## Context

The Contribute page was reframed to be a two-way value proposition: contributors
don't just *give* labour, they *gain* real production experience, a modern stack, code
review, and portfolio-grade work. As part of that, we want to recognise contributors for
meaningful work with:

1. **Profile badges** — visible markers on a user's profile reflecting what they've built.
2. **Certificates** — a shareable, verifiable document stating what a contributor did and
   over what time frame, intended to be credible enough to show an employer.

The intent is genuine: for a learner escaping "tutorial hell", a verifiable record of real
contributions to a live product is more valuable than another course certificate. This is
a real retention and recruitment lever for the platform.

However, recognition that is issued too early or too easily is worse than none:

- A certificate is a **credential**. The moment it goes on someone's CV, it makes a claim
  that must be **true and verifiable**. An unverifiable certificate is just an image
  anyone can forge, which devalues every certificate we issue.
- A certificate from a brand-new platform with no reputation carries little weight; one
  handed out for trivial effort carries *negative* weight (participation-trophy effect).
  Credibility has to be **earned by the platform first**.
- It is a **real feature**, not a footnote: it requires contribution tracking, rules for
  what earns what, certificate generation, a public verification mechanism, and badge
  display on profiles. User profiles themselves do not exist until Sprint 2.

## Decision

**Defer the contributor recognition system to post-launch / post-community.** Do not build
certificates or badges as part of the MVP. Capture the vision and a provisional spec now
(this ADR) so the idea is preserved and thought-through, but build nothing until the
preconditions below are met.

On the Contribute page, recognition is mentioned **only as "coming soon"**, worded as a
genuine future intent ("recognised... built carefully so it means something to an employer,
not a participation sticker") — never implying it can be earned today. A sample certificate
was designed for visual reference only and is explicitly marked as a sample; it is **not**
issued to anyone and is not wired to any system.

### Preconditions before building

1. **Profiles exist** (Sprint 2 — auth + profiles). Badges have nowhere to live without them.
2. **There are contributors and merged PRs to count.** Recognition is meaningless with no
   contribution history to draw on.
3. **The platform has enough reputation** that a JavaCup certificate is worth something to
   a third party. This is the softest but most important precondition.

## Provisional spec (for when the preconditions are met)

Captured so the future build starts from a considered position, not a blank page.

### Certificate — contents

Derived from the sample design. A certificate should state:

- Contributor name (from profile)
- A short, true statement of contribution to JavaCup (open-source Java-learning platform)
- **Quantified contribution**, e.g. pull requests merged
- **Time frame** — the contribution period (e.g. "Mar–Jun 2026"); the "achieved in X
  timeframe" framing is a core requirement
- Primary focus area (e.g. Frontend / React)
- A **unique issue ID** (e.g. `JC-CONTRIB-0001`)
- A **public verification URL** (e.g. `javacup.dev/verify/JC-CONTRIB-0001`) — the single
  most important element; without it the certificate is unverifiable and therefore worthless
- Founder attribution

Rendered on-brand (warm-dark, amber, Plus Jakarta / JetBrains Mono). For real issuance,
generate as PDF server-side with fonts embedded — not a screenshot.

### Verification

- A public endpoint / page resolves an issue ID to a confirmation: who it was issued to,
  what for, when. This is what makes the credential trustworthy.
- Certificates are immutable once issued; corrections are reissues with new IDs.

### Badges

- Profile badges reflecting contribution (e.g. first merged PR, sustained contribution,
  area-specific). Display on the user's profile alongside background tags.
- Tiers should be **scarce and meaningful**, not a long checklist of trivia.

### What earns recognition (the hard design question)

The crux, deliberately left open:

- Recognition must be tied to **merged, meaningful** contributions — not opened PRs, not
  comments, not low-effort changes. The bar must be high enough that the credential means
  something.
- Needs an explicit, written rubric before launch (what counts, what doesn't) to stay fair
  and resist gaming.
- Founder-reviewed initially; automatable later if volume justifies it.

## Consequences

**Positive**

- The Contribute page can honestly promise future recognition, strengthening the recruit
  pitch, without over-promising a system that doesn't exist.
- The vision is preserved with enough detail that a future build (or future team — see the
  2–3 year horizon in ADR 0005) starts from a clear position.
- We avoid issuing low-credibility credentials that would devalue the idea before the
  platform has earned the right to certify anything.

**Negative / risks**

- "Coming soon" must not linger indefinitely; if it's still absent long after a real
  community forms, remove the claim rather than leave a stale promise.
- When built, the verification mechanism and the "what counts" rubric are non-trivial and
  must be done properly — a half-built, gameable, or unverifiable system is worse than none.

**Scope note**

- This is consistent with the discipline in ADR 0005: ambitious features are documented and
  deferred, not absorbed into the MVP. The MVP boundary (PRD v2) is unchanged by this ADR.
