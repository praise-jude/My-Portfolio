export const MAX_PAYLOAD_BYTES = 2048;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PATH_RE = /^\/[A-Za-z0-9\-._~/%]*$/;
const HOST_RE = /^[a-z0-9.-]{1,255}$/;

const BOT_RE =
  /bot|crawl|spider|slurp|scrape|fetch|headless|lighthouse|pagespeed|preview|monitor|uptime|curl|wget|python-requests|httpclient|axios|go-http|java\/|okhttp|facebookexternalhit|embedly|whatsapp|telegram|discord|vercel-screenshot|phantomjs|selenium|puppeteer|playwright/i;

/** Paths that must never be counted as public traffic. */
export function isExcludedPath(path: string) {
  return (
    path === "/admin" ||
    path.startsWith("/admin/") ||
    path.startsWith("/api/") ||
    path.startsWith("/_next/")
  );
}

export function isBot(userAgent: string | null | undefined) {
  if (!userAgent || userAgent.length < 20) return true;
  return BOT_RE.test(userAgent);
}

export type Device = "mobile" | "tablet" | "desktop" | "unknown";

export function deviceFromUserAgent(userAgent: string | null | undefined): Device {
  if (!userAgent) return "unknown";
  if (/ipad|tablet|kindle|silk|playbook|(android(?!.*mobile))/i.test(userAgent)) return "tablet";
  if (/mobi|iphone|ipod|android.*mobile|windows phone|blackberry|opera mini/i.test(userAgent)) {
    return "mobile";
  }
  if (/windows|macintosh|linux|cros|x11/i.test(userAgent)) return "desktop";
  return "unknown";
}

function cleanString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v) return null;
  // Control characters are never legitimate in these fields.
  return v.slice(0, max).replace(/[\u0000-\u001f\u007f]/g, "");
}

export function normalizeReferrerHost(referrer: unknown, ownHosts: string[]): string | null {
  const raw = cleanString(referrer, 2000);
  if (!raw) return null;
  let host: string;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    host = url.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
  if (!HOST_RE.test(host)) return null;
  const own = ownHosts.map((h) => h.toLowerCase().replace(/^www\./, ""));
  return own.includes(host) ? null : host;
}

export type PageviewInput = {
  path: string;
  referrerHost: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  visitorId: string;
  sessionId: string;
};

export type ParseResult = { ok: true; value: PageviewInput } | { ok: false; error: string };

export function parsePageview(body: unknown, ownHosts: string[]): ParseResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "invalid body" };
  }
  const b = body as Record<string, unknown>;

  const path = typeof b.path === "string" ? b.path : "";
  if (!path || path.length > 300 || !PATH_RE.test(path) || path.includes("//")) {
    return { ok: false, error: "invalid path" };
  }
  if (isExcludedPath(path)) return { ok: false, error: "excluded path" };

  const visitorId = typeof b.visitorId === "string" ? b.visitorId.toLowerCase() : "";
  const sessionId = typeof b.sessionId === "string" ? b.sessionId.toLowerCase() : "";
  if (!UUID_RE.test(visitorId) || !UUID_RE.test(sessionId)) {
    return { ok: false, error: "invalid identifiers" };
  }

  return {
    ok: true,
    value: {
      path,
      referrerHost: normalizeReferrerHost(b.referrer, ownHosts),
      utmSource: cleanString(b.utmSource, 100)?.toLowerCase() ?? null,
      utmMedium: cleanString(b.utmMedium, 100)?.toLowerCase() ?? null,
      utmCampaign: cleanString(b.utmCampaign, 100) ?? null,
      visitorId,
      sessionId,
    },
  };
}

export function normalizeCountry(header: string | null | undefined): string | null {
  if (!header) return null;
  const c = header.trim().toUpperCase();
  // "XX" / "T1" are used by some CDNs for unknown or Tor traffic.
  if (!/^[A-Z]{2}$/.test(c) || c === "XX" || c === "T1") return null;
  return c;
}
