import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import { aggregate, type AnalyticsEvent, type AnalyticsSummary } from "./aggregate";
import { DEFAULT_TIMEZONE, type DateRange } from "./range";

export function analyticsTimezone() {
  return process.env.SITE_TIMEZONE || DEFAULT_TIMEZONE;
}

const PAGE_SIZE = 1000;
const MAX_EVENTS = 200_000;

export type RangeResult =
  | { ok: true; summary: AnalyticsSummary; truncated: boolean }
  | { ok: false; error: string };

export async function getRangeSummary(range: DateRange): Promise<RangeResult> {
  const supabase = createServiceClient();
  if (!supabase) return { ok: false, error: "SUPABASE_SECRET_KEY is not configured." };

  const events: AnalyticsEvent[] = [];
  for (let offset = 0; offset < MAX_EVENTS; offset += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("analytics_events")
      .select("created_at, path, referrer_host, utm_source, visitor_id, session_id, device, country")
      .gte("created_at", range.from.toISOString())
      .lt("created_at", range.to.toISOString())
      .order("id", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) return { ok: false, error: error.message };
    events.push(...(data as AnalyticsEvent[]));
    if (data.length < PAGE_SIZE) break;
  }

  return {
    ok: true,
    summary: aggregate(events, range.fromDay, range.toDay, analyticsTimezone()),
    truncated: events.length >= MAX_EVENTS,
  };
}

export type Totals = { pageviews: number; visitors: number; sessions: number };

export async function getAllTimeTotals(): Promise<Totals | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("analytics_totals");
  if (error || !data?.[0]) return null;
  const row = data[0] as Record<string, number | string>;
  return {
    pageviews: Number(row.pageviews),
    visitors: Number(row.visitors),
    sessions: Number(row.sessions),
  };
}

/**
 * Distinct visitors with a page view in the last 5 minutes. This is an
 * approximation of "online now" — the tracker sends no heartbeat, so someone
 * reading one page for 10 minutes drops out of the count.
 */
export async function getRecentlyActive(): Promise<number | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;
  const since = new Date(Date.now() - 5 * 60_000).toISOString();
  const { data, error } = await supabase
    .from("analytics_events")
    .select("visitor_id")
    .gte("created_at", since)
    .limit(5000);
  if (error) return null;
  return new Set(data.map((r) => r.visitor_id)).size;
}

export async function getLastEventAt(): Promise<string | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("analytics_events")
    .select("created_at")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.created_at ?? null;
}
