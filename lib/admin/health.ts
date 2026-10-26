import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import { adminAllowlist } from "@/lib/auth/admin";
import { getLastEventAt } from "@/lib/analytics/queries";

export type Check = { label: string; ok: boolean; detail: string; optional?: boolean };

async function tableCheck(table: string, column = "*"): Promise<Check> {
  const db = createServiceClient();
  if (!db) return { label: `Table ${table}`, ok: false, detail: "No service key" };
  const { count, error } = await db.from(table).select(column, { count: "exact", head: true });
  return error
    ? { label: `Table ${table}`, ok: false, detail: error.message || error.code || "Not reachable" }
    : { label: `Table ${table}`, ok: true, detail: `${(count ?? 0).toLocaleString("en-US")} rows` };
}

export async function getSystemStatus() {
  const env: Check[] = [
    {
      label: "NEXT_PUBLIC_SUPABASE_URL",
      ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      detail: process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host : "Missing",
    },
    {
      label: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      detail: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
    },
    {
      label: "SUPABASE_SECRET_KEY",
      ok: Boolean(process.env.SUPABASE_SECRET_KEY),
      detail: process.env.SUPABASE_SECRET_KEY ? "Set (server only)" : "Missing — admin data and analytics will not work",
    },
    {
      label: "ADMIN_EMAILS",
      ok: adminAllowlist().length > 0,
      detail: `${adminAllowlist().length} administrator(s)`,
    },
    {
      label: "HASH_SALT",
      ok: Boolean(process.env.HASH_SALT),
      optional: true,
      detail: process.env.HASH_SALT ? "Set" : "Not set — falling back to a value derived from the service key",
    },
    {
      label: "RESEND_API_KEY",
      ok: Boolean(process.env.RESEND_API_KEY),
      optional: true,
      detail: process.env.RESEND_API_KEY ? "Email notifications on" : "Not set — messages are stored but not emailed",
    },
  ];

  const db = createServiceClient();
  const [tables, subjectColumn, rpc, lastEvent] = await Promise.all([
    Promise.all(["contact_submissions", "projects", "site_content", "analytics_events", "audit_log", "rate_limits"].map((t) => tableCheck(t))),
    db
      ? db.from("contact_submissions").select("subject, read_at, archived_at", { head: true, count: "exact" }).then(({ error }) => ({
          label: "Contact message columns (subject, read, archived)",
          ok: !error,
          detail: error ? "Missing — apply the migration" : "Present",
        }))
      : Promise.resolve({ label: "Contact message columns", ok: false, detail: "No service key" }),
    db
      ? db.rpc("analytics_totals").then(({ error }) => ({
          label: "Analytics functions",
          ok: !error,
          detail: error ? error.message : "Installed",
        }))
      : Promise.resolve({ label: "Analytics functions", ok: false, detail: "No service key" }),
    getLastEventAt(),
  ]);

  return { env, database: [...tables, subjectColumn, rpc] as Check[], lastEvent };
}
