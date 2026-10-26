import type { Metadata } from "next";
import { CheckCircle2, CircleAlert, CircleMinus } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { getSystemStatus, type Check } from "@/lib/admin/health";
import { Card, Notice, PageTitle, formatDateTime } from "@/components/admin/ui";
import { AnalyticsOptOut } from "@/components/analytics/opt-out";

export const metadata: Metadata = { title: "Settings & Status" };

function CheckList({ checks }: { checks: Check[] }) {
  return (
    <ul className="divide-y divide-border-subtle">
      {checks.map((c) => {
        const Icon = c.ok ? CheckCircle2 : c.optional ? CircleMinus : CircleAlert;
        return (
          <li key={c.label} className="flex items-start gap-3 py-2.5">
            <Icon
              size={16}
              aria-label={c.ok ? "OK" : c.optional ? "Optional, not configured" : "Problem"}
              className={c.ok ? "mt-0.5 shrink-0 text-emerald-bright" : c.optional ? "mt-0.5 shrink-0 text-muted-dim" : "mt-0.5 shrink-0 text-red-400"}
            />
            <div className="min-w-0">
              <p className="font-mono text-xs text-foreground">{c.label}</p>
              <p className="break-words text-xs text-muted-dim">{c.detail}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default async function SettingsPage() {
  await requireAdmin();
  const status = await getSystemStatus();
  const healthy = [...status.env, ...status.database].every((c) => c.ok || c.optional);

  return (
    <>
      <PageTitle title="Settings & Status" description="Analytics exclusion for this browser and the health of each integration." />

      {healthy ? (
        <Notice tone="success">Everything required is configured and reachable.</Notice>
      ) : (
        <Notice tone="warning">
          Some checks are failing. If database tables are missing, run{" "}
          <code className="font-mono text-xs">supabase/migrations/20261026000000_admin_cms_analytics.sql</code> in the
          Supabase SQL editor. See <code className="font-mono text-xs">docs/ADMIN.md</code>.
        </Notice>
      )}

      <Card title="Exclude this browser from analytics" description="Signing in sets this automatically. Use it on other devices you browse your site from.">
        <AnalyticsOptOut
          optedOutLabel="This browser's visits are not counted."
          optedInLabel="This browser's visits are currently counted as public traffic."
        />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Environment" description="Values are never displayed — only whether they are set.">
          <CheckList checks={status.env} />
        </Card>
        <Card title="Database">
          <CheckList checks={status.database} />
        </Card>
      </div>

      <Card title="Analytics ingestion">
        <p className="text-sm text-muted">
          Last page view received:{" "}
          <span className="text-foreground">{status.lastEvent ? formatDateTime(status.lastEvent) : "none yet"}</span>
        </p>
        <p className="mt-2 text-xs text-muted-dim">
          To test, open the public site in a private window (where you are not signed in), visit a few pages, then
          refresh this page.
        </p>
      </Card>
    </>
  );
}
