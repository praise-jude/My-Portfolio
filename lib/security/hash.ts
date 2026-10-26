import "server-only";
import { createHash } from "node:crypto";

function salt() {
  return process.env.HASH_SALT ?? process.env.SUPABASE_SECRET_KEY ?? "local-dev-salt";
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

/**
 * One-way, salted hash of the client IP used only as a rate-limit key. The
 * day is mixed in so the value cannot be used to follow anyone across days.
 * Raw IPs are never stored.
 */
export function hashedClientKey(headers: Headers): string {
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256")
    .update(`${salt()}|${day}|${clientIp(headers)}`)
    .digest("hex")
    .slice(0, 32);
}

export function hashValue(value: string): string {
  return createHash("sha256").update(`${salt()}|${value}`).digest("hex").slice(0, 32);
}
