import { describe, expect, it } from "vitest";
import { aggregate, summaryToCsv, type AnalyticsEvent } from "@/lib/analytics/aggregate";

const V1 = "11111111-1111-4111-8111-111111111111";
const V2 = "22222222-2222-4222-8222-222222222222";
const S1 = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const S2 = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const S3 = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

function ev(partial: Partial<AnalyticsEvent> & Pick<AnalyticsEvent, "created_at">): AnalyticsEvent {
  return {
    path: "/",
    referrer_host: null,
    utm_source: null,
    visitor_id: V1,
    session_id: S1,
    device: "desktop",
    country: null,
    ...partial,
  };
}

const TZ = "Africa/Lagos"; // UTC+1, no DST

describe("aggregate", () => {
  const events = [
    // Visitor 1, session 1: arrives from Google on /, then views /projects twice.
    ev({ created_at: "2026-10-20T09:00:00Z", referrer_host: "google.com", country: "NG" }),
    ev({ created_at: "2026-10-20T09:01:00Z", path: "/projects" }),
    ev({ created_at: "2026-10-20T09:02:00Z", path: "/projects" }),
    // Visitor 1, session 2 next day, direct.
    ev({ created_at: "2026-10-21T10:00:00Z", session_id: S2, path: "/about" }),
    // Visitor 2 on mobile via a campaign; 23:30 UTC is 00:30 on the 22nd in Lagos.
    ev({
      created_at: "2026-10-21T23:30:00Z",
      visitor_id: V2,
      session_id: S3,
      device: "mobile",
      utm_source: "newsletter",
      referrer_host: "mail.example.com",
      country: "GH",
    }),
  ];

  const s = aggregate(events, "2026-10-20", "2026-10-22", TZ);

  it("distinguishes page views, unique visitors and sessions", () => {
    expect(s.pageviews).toBe(5);
    expect(s.visitors).toBe(2);
    expect(s.sessions).toBe(3);
    expect(s.pagesPerSession).toBe(1.7);
  });

  it("buckets days in the site timezone, not UTC", () => {
    expect(s.daily).toEqual([
      { day: "2026-10-20", pageviews: 3, visitors: 1, sessions: 1 },
      { day: "2026-10-21", pageviews: 1, visitors: 1, sessions: 1 },
      { day: "2026-10-22", pageviews: 1, visitors: 1, sessions: 1 },
    ]);
  });

  it("includes empty days so charts have no gaps", () => {
    const empty = aggregate([], "2026-10-01", "2026-10-03", TZ);
    expect(empty.daily.map((d) => d.pageviews)).toEqual([0, 0, 0]);
    expect(empty.pagesPerSession).toBe(0);
  });

  it("attributes sources and landing pages to the first event of each session", () => {
    expect(s.sources).toEqual([
      { label: "Direct / none", count: 1 },
      { label: "google.com", count: 1 },
      { label: "newsletter", count: 1 },
    ]);
    // Sessions 1 and 3 land on "/", session 2 on "/about"; /projects is never a landing page.
    expect(s.landingPages).toEqual([
      { label: "/", count: 2 },
      { label: "/about", count: 1 },
    ]);
  });

  it("counts top pages by page view, breaking ties alphabetically", () => {
    expect(s.topPages).toEqual([
      { label: "/", count: 2 },
      { label: "/projects", count: 2 },
      { label: "/about", count: 1 },
    ]);
  });

  it("counts devices and countries once per visitor", () => {
    expect(s.devices).toEqual([
      { label: "desktop", count: 1 },
      { label: "mobile", count: 1 },
    ]);
    expect(s.countries).toEqual([
      { label: "GH", count: 1 },
      { label: "NG", count: 1 },
    ]);
  });

  it("is independent of input order", () => {
    const reversed = aggregate([...events].reverse(), "2026-10-20", "2026-10-22", TZ);
    expect(reversed).toEqual(s);
  });
});

describe("summaryToCsv", () => {
  it("neutralises spreadsheet formulas and quotes commas", () => {
    const csv = summaryToCsv(
      {
        ...aggregate([], "2026-10-01", "2026-10-01", TZ),
        topPages: [{ label: "=HYPERLINK(\"x\")", count: 1 }],
        sources: [{ label: "a,b", count: 2 }],
      },
      "test"
    );
    expect(csv).toContain(`"'=HYPERLINK(""x"")",1`);
    expect(csv).toContain(`"a,b",2`);
    expect(csv.startsWith("Range,test\r\n")).toBe(true);
  });
});
