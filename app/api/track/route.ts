import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { hashedClientKey } from "@/lib/security/hash";
import {
  MAX_PAYLOAD_BYTES,
  deviceFromUserAgent,
  isBot,
  normalizeCountry,
  parsePageview,
} from "@/lib/analytics/ingest";
import { NO_TRACK_COOKIE } from "@/lib/analytics/constants";
import { site } from "@/lib/data";

// Always answer with an empty 204 for anything we deliberately skip, so the
// endpoint reveals nothing about why an event was or wasn't stored.
const skip = () => new NextResponse(null, { status: 204 });

function isSameOrigin(request: NextRequest) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite) return fetchSite === "same-origin";
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return skip();

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }

  const userAgent = request.headers.get("user-agent");
  if (isBot(userAgent)) return skip();
  if (request.cookies.get(NO_TRACK_COOKIE)?.value === "1") return skip();

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  if (raw.length > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const ownHosts = [new URL(site.url).hostname, request.headers.get("host")?.split(":")[0] ?? ""];
  const parsed = parsePageview(body, ownHosts);
  if (!parsed.ok) {
    if (parsed.error === "excluded path") return skip();
    return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  }

  const supabase = createServiceClient();
  if (!supabase) return skip();

  const e = parsed.value;
  const { error } = await supabase.rpc("track_pageview", {
    p_rate_key: `track:${hashedClientKey(request.headers)}`,
    p_path: e.path,
    p_referrer_host: e.referrerHost,
    p_utm_source: e.utmSource,
    p_utm_medium: e.utmMedium,
    p_utm_campaign: e.utmCampaign,
    p_visitor_id: e.visitorId,
    p_session_id: e.sessionId,
    p_device: deviceFromUserAgent(userAgent),
    p_country: normalizeCountry(request.headers.get("x-vercel-ip-country")),
  });

  if (error) console.error("[track] failed to store event", error.message);
  return skip();
}
