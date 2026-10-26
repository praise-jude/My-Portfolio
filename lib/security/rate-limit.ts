import "server-only";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * Fixed-window rate limit backed by Postgres, so it holds across serverless
 * instances. Returns true when the request is allowed.
 *
 * Fails open (allows) when the database is unavailable: every protected
 * operation also depends on that database, so it would fail anyway, and the
 * public contact form should not be blocked by a limiter outage.
 */
export async function rateLimit(key: string, windowSeconds: number, max: number) {
  const supabase = createServiceClient();
  if (!supabase) return true;

  const { data, error } = await supabase.rpc("rate_limit_hit", {
    p_key: key,
    p_window_seconds: windowSeconds,
    p_max: max,
  });

  if (error) {
    console.warn("[rate-limit] check failed, allowing request", error.message);
    return true;
  }
  return data === true;
}
