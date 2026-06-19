import { supabase } from './supabase';

/**
 * Tiny API client for the JavaCup backend.
 *
 * Attaches the current Supabase session's access token as a Bearer header so the Spring
 * backend can validate it (see backend SecurityConfig). Base URL comes from
 * VITE_API_BASE_URL, falling back to the local Spring port for dev.
 *
 * Usage: const data = await apiFetch('/api/v1/auth/sync', { method: 'POST' });
 * Throws on non-2xx with the status and any error body, so callers can try/catch.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export async function apiFetch(path, options = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let body = null;
    try {
      body = await res.json();
    } catch {
      // non-JSON error body; ignore
    }
    const err = new Error(`API ${res.status} on ${path}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  // 204 No Content → return null rather than choking on empty body.
  if (res.status === 204) return null;
  return res.json();
}
