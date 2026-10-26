import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { resolveRange } from "@/lib/analytics/range";
import { analyticsTimezone, getAllTimeTotals, getRangeSummaries, getRecentlyActive } from "@/lib/analytics/queries";
import { getMessageTotals, getMessages } from "@/lib/admin/messages";
import { getRecentAudit } from "@/lib/admin/audit";
import { BarList, Card, EmptyState, Notice, PageTitle, StatCard, formatDateTime } from "@/components/admin/ui";
import { TrendChart } from "@/components/admin/trend-chart";
import { RangePicker } from "@/components/admin/range-picker";
import { describeAction } from "@/lib/admin/audit-labels";

export const metadata: Metadata = { title: "Dashboard" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function DashboardPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const now = new Date();
  const tz = analyticsTimezone();
  const range = resolveRange({ range: one(params.range), from: one(params.from), to: one(params.to) }, now, tz);

  const [[rangeResult, todayResult, weekResult, monthResult], totals, active, messageTotal, recentMessages, audit] =
    await Promise.all([
      getRangeSummaries([
        range,
        resolveRange({ range: "today" }, now, tz),
        resolveRange({ range: "7d" }, now, tz),
        resolveRange({ range: "30d" }, now, tz),
      ]),
      getAllTimeTotals(),
      getRecentlyActive(),
      getMessageTotals(),
      getMessages({ pageSize: 5 }),
      getRecentAudit(8),
    ]);

  const visitors = (r: typeof todayResult) => (r.ok ? r.summary.visitors : null);
  const summary = rangeResult.ok ? rangeResult.summary : null;
  const noData = summary && summary.pageviews === 0;

  return (
    <>
      <PageTitle
        title="Dashboard"
        description={`Live data from your website. Times shown in ${tz}.`}
        actions={<RangePicker basePath="/admin" range={range} />}
      />

      {!rangeResult.ok ? (
        <Notice tone="error">
          Analytics are unavailable: {rangeResult.error}{" "}
          <Link className="underline" href="/admin/settings">
            Check system status
          </Link>
          .
        </Notice>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="All-time visitors" value={totals?.visitors ?? null} hint="Unique, since tracking began" />
        <StatCard label="All-time page views" value={totals?.pageviews ?? null} />
        <StatCard label="Visitors today" value={visitors(todayResult)} />
        <StatCard label="Active now" value={active} hint="Visitors seen in the last 5 minutes" />
        <StatCard label="Visitors · 7 days" value={visitors(weekResult)} />
        <StatCard label="Visitors · 30 days" value={visitors(monthResult)} />
        <StatCard label="All-time sessions" value={totals?.sessions ?? null} />
        <StatCard label="Contact messages" value={messageTotal} hint="All time" />
      </div>

      {summary ? (
        <>
          <Card
            title={`Traffic · ${range.label}`}
            description={`${summary.pageviews.toLocaleString("en-US")} page views · ${summary.visitors.toLocaleString("en-US")} unique visitors · ${summary.sessions.toLocaleString("en-US")} sessions · ${summary.pagesPerSession} pages per session`}
          >
            {noData ? (
              <EmptyState title="No visits recorded in this range">
                Page views appear here as soon as someone visits the public site. Your own visits are excluded.
              </EmptyState>
            ) : (
              <TrendChart data={summary.daily} />
            )}
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card title="Most visited pages">
              <BarList items={summary.topPages} />
            </Card>
            <Card title="Top traffic sources" description="How each session started">
              <BarList items={summary.sources} />
            </Card>
            <Card title="Devices" description="Per unique visitor">
              <BarList items={summary.devices} />
            </Card>
            <Card title="Top countries" description="From the hosting provider's geolocation; blank if unavailable">
              <BarList items={summary.countries} emptyText="No country data in this range." />
            </Card>
          </div>
        </>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card
          title="Latest messages"
          actions={
            <Link href="/admin/messages" className="focus-ring text-xs text-gold-bright hover:underline">
              View all
            </Link>
          }
        >
          {recentMessages.ok && recentMessages.messages.length ? (
            <ul className="divide-y divide-border-subtle">
              {recentMessages.messages.map((m) => (
                <li key={m.id} className="py-2.5">
                  <p className="flex items-center gap-2 text-sm text-foreground">
                    {!m.read_at && !recentMessages.legacy ? (
                      <span className="size-1.5 rounded-full bg-gold-bright" aria-label="Unread" />
                    ) : null}
                    <span className="truncate font-medium">{m.name}</span>
                    <span className="truncate text-muted-dim">{m.subject ?? m.email}</span>
                  </p>
                  <p className="text-xs text-muted-dim">{formatDateTime(m.created_at)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title={recentMessages.ok ? "No messages yet" : "Messages unavailable"} />
          )}
        </Card>

        <Card
          title="Recent admin activity"
          actions={
            <Link href="/admin/audit" className="focus-ring text-xs text-gold-bright hover:underline">
              Audit log
            </Link>
          }
        >
          {audit.length ? (
            <ul className="divide-y divide-border-subtle">
              {audit.map((a) => (
                <li key={a.id} className="py-2.5">
                  <p className="text-sm text-foreground">{describeAction(a)}</p>
                  <p className="text-xs text-muted-dim">
                    {a.actor} · {formatDateTime(a.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No activity recorded yet" />
          )}
        </Card>
      </div>
    </>
  );
}
