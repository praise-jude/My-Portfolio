import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const REQUEST_TIMEOUT_MS = 8000;

// Bounded fetch so a paused or unreachable database degrades a page to its
// fallback content instead of hanging the render.
const timedFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS) });

let cached: SupabaseClient | null | undefined;

/**
 * Server-only Supabase client using the secret (service role) key. Bypasses
 * RLS, so it must only ever run after the caller has done its own
 * authorization check. Returns null when the key is not configured.
 */
export function createServiceClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  cached =
    url && key
      ? createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: { fetch: timedFetch },
        })
      : null;

  return cached;
}
