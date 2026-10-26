"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminAllowlist, getAdminUser } from "@/lib/auth/admin";
import { isAuthorizedAdmin } from "@/lib/auth/allowlist";
import { rateLimit } from "@/lib/security/rate-limit";
import { hashValue, hashedClientKey } from "@/lib/security/hash";
import { logAudit } from "@/lib/audit";
import { isEmail, formString } from "@/lib/validation";
import { NO_TRACK_COOKIE, NO_TRACK_MAX_AGE } from "@/lib/analytics/constants";

export type LoginState = { error?: string };

const GENERIC_ERROR = "Invalid email or password.";

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = formString(form, "email").toLowerCase();
  const password = typeof form.get("password") === "string" ? (form.get("password") as string) : "";

  if (!isEmail(email) || !password || password.length > 200) return { error: GENERIC_ERROR };

  const h = await headers();
  const ipKey = hashedClientKey(h);
  // 5 attempts per 15 minutes per network, 10 per hour per account.
  const [ipOk, accountOk] = await Promise.all([
    rateLimit(`login:ip:${ipKey}`, 900, 5),
    rateLimit(`login:acct:${hashValue(email)}`, 3600, 10),
  ]);
  if (!ipOk || !accountOk) {
    await logAudit({ actor: email, action: "login_rate_limited" });
    return { error: "Too many sign-in attempts. Please wait a few minutes and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    await logAudit({ actor: email, action: "login_failed", details: { reason: "credentials" } });
    return { error: GENERIC_ERROR };
  }

  if (!isAuthorizedAdmin(data.user, adminAllowlist())) {
    // Valid Supabase account, but not an administrator: end the session.
    await supabase.auth.signOut();
    await logAudit({ actor: email, action: "login_failed", details: { reason: "not_admin" } });
    return { error: GENERIC_ERROR };
  }

  // Keep the admin's own browsing out of the public visitor statistics.
  (await cookies()).set(NO_TRACK_COOKIE, "1", {
    path: "/",
    maxAge: NO_TRACK_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  await logAudit({ actor: email, action: "login" });
  redirect("/admin");
}

export async function logoutAction() {
  const admin = await getAdminUser();
  const supabase = await createClient();
  await supabase.auth.signOut();
  if (admin) await logAudit({ actor: admin.email, action: "logout" });
  redirect("/admin/login");
}
