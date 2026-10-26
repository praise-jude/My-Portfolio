export function parseAdminEmails(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

type MinimalUser = {
  email?: string | null;
  email_confirmed_at?: string | null;
};

/**
 * A user is an administrator only when their email is on the server-side
 * allowlist AND Supabase has confirmed they own that address. The
 * confirmation check stops someone from signing up with an allowlisted
 * address they do not control.
 */
export function isAuthorizedAdmin(user: MinimalUser | null | undefined, allowlist: string[]) {
  if (!user?.email || !user.email_confirmed_at) return false;
  return allowlist.includes(user.email.toLowerCase());
}
