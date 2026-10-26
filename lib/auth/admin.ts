import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAuthorizedAdmin, parseAdminEmails } from "@/lib/auth/allowlist";

export type AdminUser = { id: string; email: string };

export function adminAllowlist() {
  return parseAdminEmails(process.env.ADMIN_EMAILS);
}

/**
 * Verifies the session with Supabase (getUser re-validates the JWT on the
 * auth server rather than trusting the cookie) and checks the allowlist.
 * Cached per request so layouts and pages share one lookup.
 */
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    if (!isAuthorizedAdmin(data.user, adminAllowlist())) return null;
    return { id: data.user.id, email: data.user.email! };
  } catch {
    return null;
  }
});

/** Call at the top of every admin page, server action and route handler. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");
  return admin;
}
