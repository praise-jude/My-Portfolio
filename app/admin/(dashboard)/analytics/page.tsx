import type { Metadata } from "next";
import { Download } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { resolveRange } from "@/lib/analytics/range";
import { analyticsTimezone, getRangeSummary } from "@/lib/analytics/queries";
import { BarList, Card, EmptyState, Notice, PageTitle, StatCard } from "@/components/admin/ui";
import { TrendChart } from "@/components/admin/trend-chart";
import { RangePicker } from "@/components/admin/range-picker";

export const metadata: Metadata = { title: "Analytics" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function AnalyticsPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const tz = analyticsTimezone();
  const range = resolveRange({ range: one(params.range), from: one(params.from), to: one(params.to) }, new Date(), tz);
  const result = await getRangeSummary(range);

  const exportQuery = new URLSearchParams({ range: range.key, from: range.fromDay, to: range.toDay }).toString();

  return (
    <>
      <PageTitle
        title="Analytics"
        description={`${range.label} · ${range.fromDay} to ${range.toDay} (${tz})`}
        actions={
          <a
            href={`/admin/analytics/export?${exportQuery}`}
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-border-subtle px-4 py-2 text-sm text-muted hover:text-foreground"
          >
            <Download size={14} /> Export CSV
          </a>
        }
      />
      <RangePicker basePath="/admin/analytics" range={range} />

      {!result.ok ? (
        <Notice tone="error">Analytics are unavailable: {result.error}</Notice>
      ) : (
        <>
          {result.truncated ? (
            <Notice tone="warning">This range has more than 200,000 events; only the first 200,000 are included.</Notice>
          ) : null}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Page views" value={result.summary.pageviews} />
            <StatCard label="Unique visitors" value={result.summary.visitors} hint="Estimate — see counting rules" />
            <StatCard label="Sessions" value={result.summary.sessions} />
            <StatCard label="Pages per session" value={result.summary.pagesPerSession} />
          </div>

          <Card title="Daily traffic">
            {result.summary.pageviews === 0 ? (
              <EmptyState title="No visits recorded in this range" />
            ) : (
              <TrendChart data={result.summary.daily} />
            )}
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card title="Most visited pages" description="All page views">
              <BarList items={result.summary.topPages} />
            </Card>
            <Card title="Landing pages" description="First page of each session">
              <BarList items={result.summary.landingPages} />
            </Card>
            <Card title="Traffic sources" description="Campaign source, else referring site, per session">
              <BarList items={result.summary.sources} />
            </Card>
            <Card title="Devices" description="Per unique visitor">
              <BarList items={result.summary.devices} />
            </Card>
            <Card title="Countries" description="Per unique visitor, from the hosting provider">
              <BarList items={result.summary.countries} emptyText="No country data in this range." />
            </Card>
            <Card title="How these numbers are counted">
              <ul className="flex list-disc flex-col gap-2 pl-4 text-xs leading-relaxed text-muted">
                <li><strong className="text-foreground/90">Page view</strong> — each public page load or in-site navigation. Repeat loads of the same page within 3 seconds are ignored.</li>
                <li><strong className="text-foreground/90">Unique visitor</strong> — a random ID stored in the visitor&apos;s browser. The same person on two devices counts twice; clearing browser data counts as new.</li>
                <li><strong className="text-foreground/90">Session</strong> — ends after 30 minutes with no page view.</li>
                <li>Not counted: /admin pages, your own browser (signed in or excluded in Settings), bots and automated browsers, and visitors with Do Not Track / Global Privacy Control.</li>
                <li>Only data collected since tracking was installed is shown — there is no imported history.</li>
              </ul>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
