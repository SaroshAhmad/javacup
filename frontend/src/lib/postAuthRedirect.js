/**
 * Post-auth redirect ("return path") helpers.
 *
 * When a user is sent to auth from a specific intent (e.g. clicking "Contribute" while
 * logged out), we remember where they wanted to go and send them there once authenticated
 * — instead of the generic default. The destination travels two ways:
 *
 *  - as a `?redirect=` query param on /login and /signup (survives refresh, visible), and
 *  - mirrored into sessionStorage, so it also survives the signup email-confirmation round
 *    trip (the confirmation link opens a fresh page with no query param).
 *
 * Only same-origin absolute paths (starting with a single "/") are honoured, so this can
 * never be used to bounce a user to an external URL.
 */
const KEY = 'postAuthRedirect';
const DEFAULT_DESTINATION = '/roadmap';

/** Accepts only safe in-app paths like "/contribute"; rejects "//evil.com", "http…", etc. */
export function safePath(value) {
  if (typeof value !== 'string') return null;
  if (!value.startsWith('/')) return null;
  if (value.startsWith('//')) return null;
  return value;
}

/** Reads a redirect target from a query string (e.g. location.search). */
export function redirectFromSearch(search) {
  const raw = new URLSearchParams(search).get('redirect');
  return safePath(raw);
}

export function storeRedirect(path) {
  const safe = safePath(path);
  if (safe) {
    try { sessionStorage.setItem(KEY, safe); } catch { /* storage unavailable — ignore */ }
  }
}

export function consumeRedirect() {
  let stored = null;
  try {
    stored = sessionStorage.getItem(KEY);
    if (stored) sessionStorage.removeItem(KEY);
  } catch { /* ignore */ }
  return safePath(stored);
}

export { DEFAULT_DESTINATION };
