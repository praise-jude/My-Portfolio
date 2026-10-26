import { dayKey, daysBetween } from "./range";

export type AnalyticsEvent = {
  created_at: string;
  path: string;
  referrer_host: string | null;
  utm_source: string | null;
  visitor_id: string;
  session_id: string;
  device: string;
  country: string | null;
};

export type Counted = { label: string; count: number };

export type DailyPoint = { day: string; pageviews: number; visitors: number; sessions: number };

export type AnalyticsSummary = {
  pageviews: number;
  visitors: number;
  sessions: number;
  daily: DailyPoint[];
  topPages: Counted[];
  landingPages: Counted[];
  sources: Counted[];
  countries: Counted[];
  devices: Counted[];
  pagesPerSession: number;
};

function top(map: Map<string, number>, limit: number): Counted[] {
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}

function bump(map: Map<string, number>, key: string, by = 1) {
  map.set(key, (map.get(key) ?? 0) + by);
}

/**
 * Counting rules (also documented in docs/ADMIN.md):
 * - Page view: one stored event.
 * - Unique visitor: distinct visitor_id (random ID kept in the browser's
 *   localStorage). One person on two devices/browsers counts twice; clearing
 *   storage starts a new visitor. It is an estimate, not a head count.
 * - Session: distinct session_id; a session ends after 30 minutes without a
 *   page view.
 * - Source/landing page: taken from the first event of each session, so a
 *   visitor who arrives from Google and clicks around is one Google session.
 * - Devices and countries are counted per unique visitor (their first event).
 */
export function aggregate(
  events: AnalyticsEvent[],
  fromDay: string,
  toDay: string,
  timeZone: string,
  limit = 10
): AnalyticsSummary {
  const sorted = [...events].sort((a, b) => a.created_at.localeCompare(b.created_at));

  const visitors = new Set<string>();
  const sessions = new Map<string, AnalyticsEvent>();
  const pages = new Map<string, number>();
  const devicesByVisitor = new Map<string, string>();
  const countriesByVisitor = new Map<string, string>();

  const days = daysBetween(fromDay, toDay);
  const perDay = new Map(
    days.map((d) => [d, { pageviews: 0, visitors: new Set<string>(), sessions: new Set<string>() }])
  );

  for (const e of sorted) {
    visitors.add(e.visitor_id);
    if (!sessions.has(e.session_id)) sessions.set(e.session_id, e);
    bump(pages, e.path);
    if (!devicesByVisitor.has(e.visitor_id)) devicesByVisitor.set(e.visitor_id, e.device);
    if (e.country && !countriesByVisitor.has(e.visitor_id)) countriesByVisitor.set(e.visitor_id, e.country);

    const bucket = perDay.get(dayKey(new Date(e.created_at), timeZone));
    if (bucket) {
      bucket.pageviews += 1;
      bucket.visitors.add(e.visitor_id);
      bucket.sessions.add(e.session_id);
    }
  }

  const landing = new Map<string, number>();
  const sources = new Map<string, number>();
  for (const first of sessions.values()) {
    bump(landing, first.path);
    bump(sources, first.utm_source ?? first.referrer_host ?? "Direct / none");
  }

  const devices = new Map<string, number>();
  for (const d of devicesByVisitor.values()) bump(devices, d);
  const countries = new Map<string, number>();
  for (const c of countriesByVisitor.values()) bump(countries, c);

  return {
    pageviews: sorted.length,
    visitors: visitors.size,
    sessions: sessions.size,
    daily: days.map((day) => {
      const b = perDay.get(day)!;
      return { day, pageviews: b.pageviews, visitors: b.visitors.size, sessions: b.sessions.size };
    }),
    topPages: top(pages, limit),
    landingPages: top(landing, limit),
    sources: top(sources, limit),
    countries: top(countries, limit),
    devices: top(devices, 4),
    pagesPerSession: sessions.size ? Math.round((sorted.length / sessions.size) * 10) / 10 : 0,
  };
}

function csvCell(value: string | number) {
  const s = String(value);
  // Prefix cells that a spreadsheet would treat as a formula.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function summaryToCsv(summary: AnalyticsSummary, rangeLabel: string): string {
  const rows: (string | number)[][] = [
    ["Range", rangeLabel],
    ["Page views", summary.pageviews],
    ["Unique visitors (estimate)", summary.visitors],
    ["Sessions", summary.sessions],
    [],
    ["Day", "Page views", "Unique visitors", "Sessions"],
    ...summary.daily.map((d) => [d.day, d.pageviews, d.visitors, d.sessions]),
    [],
    ["Top pages", "Page views"],
    ...summary.topPages.map((p) => [p.label, p.count]),
    [],
    ["Traffic source", "Sessions"],
    ...summary.sources.map((p) => [p.label, p.count]),
    [],
    ["Device", "Visitors"],
    ...summary.devices.map((p) => [p.label, p.count]),
    [],
    ["Country", "Visitors"],
    ...summary.countries.map((p) => [p.label, p.count]),
  ];
  return rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}
