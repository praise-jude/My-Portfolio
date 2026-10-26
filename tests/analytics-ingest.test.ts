import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  deviceFromUserAgent,
  isBot,
  normalizeCountry,
  normalizeReferrerHost,
  parsePageview,
} from "@/lib/analytics/ingest";

const rpc = vi.fn();
vi.mock("@/lib/supabase/service", () => ({ createServiceClient: () => ({ rpc }) }));

const { POST } = await import("@/app/api/track/route");

const CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const IPAD =
  "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

const valid = {
  path: "/projects/inventra",
  visitorId: "11111111-1111-4111-8111-111111111111",
  sessionId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  referrer: "https://www.google.com/search?q=jude",
  utmSource: "LinkedIn",
};

function request(body: unknown, headers: Record<string, string> = {}) {
  const raw = typeof body === "string" ? body : JSON.stringify(body);
  return new NextRequest("https://www.jude-omini-ewah.com.ng/api/track", {
    method: "POST",
    body: raw,
    headers: {
      host: "www.jude-omini-ewah.com.ng",
      "sec-fetch-site": "same-origin",
      "user-agent": CHROME,
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.9",
      "x-vercel-ip-country": "ng",
      ...headers,
    },
  });
}

describe("parsePageview", () => {
  const own = ["jude-omini-ewah.com.ng"];

  it("accepts a valid page view and normalises fields", () => {
    const r = parsePageview(valid, own);
    expect(r).toEqual({
      ok: true,
      value: {
        path: "/projects/inventra",
        referrerHost: "google.com",
        utmSource: "linkedin",
        utmMedium: null,
        utmCampaign: null,
        visitorId: valid.visitorId,
        sessionId: valid.sessionId,
      },
    });
  });

  it.each([
    ["admin pages", { ...valid, path: "/admin" }],
    ["admin subpages", { ...valid, path: "/admin/projects" }],
    ["api routes", { ...valid, path: "/api/track" }],
  ])("never counts %s", (_label, body) => {
    expect(parsePageview(body, own)).toEqual({ ok: false, error: "excluded path" });
  });

  it.each([
    ["absolute URLs", "https://evil.example/"],
    ["protocol-relative paths", "//evil.example"],
    ["script injection", "/<script>"],
    ["query strings", "/?q=1"],
    ["oversized paths", `/${"a".repeat(400)}`],
    ["non-strings", 42],
  ])("rejects %s", (_label, path) => {
    expect(parsePageview({ ...valid, path }, own).ok).toBe(false);
  });

  it("rejects missing or malformed identifiers", () => {
    expect(parsePageview({ ...valid, visitorId: "not-a-uuid" }, own).ok).toBe(false);
    expect(parsePageview({ ...valid, sessionId: undefined }, own).ok).toBe(false);
    expect(parsePageview(null, own).ok).toBe(false);
    expect(parsePageview([valid], own).ok).toBe(false);
  });

  it("drops self-referrals and non-http referrers", () => {
    expect(normalizeReferrerHost("https://www.jude-omini-ewah.com.ng/about", own)).toBeNull();
    expect(normalizeReferrerHost("javascript:alert(1)", own)).toBeNull();
    expect(normalizeReferrerHost("android-app://com.google", own)).toBeNull();
    expect(normalizeReferrerHost("https://t.co/abc", own)).toBe("t.co");
  });
});

describe("classification", () => {
  it("detects bots and automation", () => {
    expect(isBot(CHROME)).toBe(false);
    expect(isBot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")).toBe(true);
    expect(isBot("curl/8.4.0")).toBe(true);
    expect(isBot("Mozilla/5.0 HeadlessChrome/130.0")).toBe(true);
    expect(isBot(null)).toBe(true);
  });

  it("classifies devices", () => {
    expect(deviceFromUserAgent(CHROME)).toBe("desktop");
    expect(deviceFromUserAgent(IPHONE)).toBe("mobile");
    expect(deviceFromUserAgent(IPAD)).toBe("tablet");
    expect(deviceFromUserAgent("Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 Chrome/130 Safari/537.36")).toBe("tablet");
    expect(deviceFromUserAgent("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36")).toBe("mobile");
  });

  it("normalises countries and drops unknown markers", () => {
    expect(normalizeCountry("ng")).toBe("NG");
    expect(normalizeCountry("XX")).toBeNull();
    expect(normalizeCountry("T1")).toBeNull();
    expect(normalizeCountry("Nigeria")).toBeNull();
  });
});

describe("POST /api/track", () => {
  beforeEach(() => {
    rpc.mockReset();
    rpc.mockResolvedValue({ data: true, error: null });
  });

  it("stores a valid page view with server-derived device and country", async () => {
    const res = await POST(request(valid));
    expect(res.status).toBe(204);
    expect(rpc).toHaveBeenCalledTimes(1);
    const [fn, args] = rpc.mock.calls[0];
    expect(fn).toBe("track_pageview");
    expect(args).toMatchObject({
      p_path: "/projects/inventra",
      p_referrer_host: "google.com",
      p_device: "desktop",
      p_country: "NG",
      p_visitor_id: valid.visitorId,
    });
    // The rate-limit key is a salted hash, never the raw IP.
    expect(args.p_rate_key).toMatch(/^track:[0-9a-f]{32}$/);
    expect(JSON.stringify(args)).not.toContain("203.0.113.9");
  });

  it("ignores cross-site requests", async () => {
    const res = await POST(request(valid, { "sec-fetch-site": "cross-site" }));
    expect(res.status).toBe(204);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("ignores bots", async () => {
    await POST(request(valid, { "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" }));
    expect(rpc).not.toHaveBeenCalled();
  });

  it("ignores browsers carrying the no-track cookie (admins)", async () => {
    await POST(request(valid, { cookie: "jo_no_track=1" }));
    expect(rpc).not.toHaveBeenCalled();
  });

  it("silently skips admin paths", async () => {
    const res = await POST(request({ ...valid, path: "/admin" }));
    expect(res.status).toBe(204);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("rejects oversized payloads", async () => {
    const res = await POST(request({ ...valid, utmCampaign: "x".repeat(5000) }));
    expect(res.status).toBe(413);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON and invalid events", async () => {
    expect((await POST(request("{not json"))).status).toBe(400);
    expect((await POST(request({ ...valid, path: "https://x" }))).status).toBe(400);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("does not fail the visitor's page when storage errors", async () => {
    rpc.mockResolvedValue({ data: null, error: { message: "db down" } });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await POST(request(valid))).status).toBe(204);
    spy.mockRestore();
  });
});
