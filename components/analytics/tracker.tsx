"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  NO_TRACK_COOKIE,
  SESSION_IDLE_MS,
  SESSION_KEY,
  VISITOR_KEY,
} from "@/lib/analytics/constants";

// Module-level so React Strict Mode's double effect run (dev) and duplicate
// mounts can't record the same page view twice.
let lastSent: { path: string; at: number } | null = null;
let firstViewInPageLoad = true;

function uuid() {
  // randomUUID needs a secure context; fall back for plain-http local testing.
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function trackingDisabled() {
  if (document.cookie.split("; ").includes(`${NO_TRACK_COOKIE}=1`)) return true;
  // Honour Global Privacy Control / Do Not Track browser signals.
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.globalPrivacyControl || navigator.doNotTrack === "1") return true;
  return Boolean(navigator.webdriver);
}

function identifiers(now: number) {
  let visitorId = localStorage.getItem(VISITOR_KEY);
  if (!visitorId) {
    visitorId = uuid();
    localStorage.setItem(VISITOR_KEY, visitorId);
  }

  let sessionId: string | null = null;
  let isNewSession = false;
  try {
    const stored = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null") as
      | { id: string; t: number }
      | null;
    if (stored && now - stored.t < SESSION_IDLE_MS) sessionId = stored.id;
  } catch {
    // Corrupt value — start a new session.
  }
  if (!sessionId) {
    sessionId = uuid();
    isNewSession = true;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ id: sessionId, t: now }));

  return { visitorId, sessionId, isNewSession };
}

function send(path: string) {
  const now = Date.now();
  if (lastSent && lastSent.path === path && now - lastSent.at < 3000) return;
  lastSent = { path, at: now };

  let ids;
  try {
    ids = identifiers(now);
  } catch {
    return; // Storage blocked (private mode, disabled site data).
  }

  const params = new URLSearchParams(window.location.search);
  // Referrer and campaign tags only describe how a session started.
  const attribution = ids.isNewSession || firstViewInPageLoad;
  firstViewInPageLoad = false;

  const payload = JSON.stringify({
    path,
    visitorId: ids.visitorId,
    sessionId: ids.sessionId,
    referrer: attribution ? document.referrer || null : null,
    utmSource: attribution ? params.get("utm_source") : null,
    utmMedium: attribution ? params.get("utm_medium") : null,
    utmCampaign: attribution ? params.get("utm_campaign") : null,
  });

  const blob = new Blob([payload], { type: "application/json" });
  if (!navigator.sendBeacon?.("/api/track", blob)) {
    fetch("/api/track", {
      method: "POST",
      body: payload,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
  }
}

export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || trackingDisabled()) return;
    send(pathname);
  }, [pathname]);

  return null;
}
