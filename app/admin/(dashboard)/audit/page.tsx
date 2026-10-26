import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";
import { getAuditPage } from "@/lib/admin/audit";
import { ACTION_LABELS, describeAction } from "@/lib/admin/audit-labels";
import { Card, EmptyState, Notice, PageTitle, Pagination, formatDateTime, pageParam, stringParam } from "@/components/admin/ui";
import { inputClass } from "@/components/admin/form-styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Audit Log" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AuditPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const action = stringParam(params.action);
  const page = pageParam(params.page);
  const result = await getAuditPage({ action: action || undefined, page });

  return (
    <>
      <PageTitle title="Audit Log" description="Sign-ins, failed sign-in attempts, and every content change. Entries cannot be edited from the dashboard." />

      <form method="get" className="flex flex-wrap items-center gap-2">
        <label htmlFor="action" className="text-xs text-muted">Filter</label>
        <select id="action" name="action" defaultValue={action} className={cn(inputClass, "w-auto py-1.5")}>
          <option value="">All actions</option>
          {Object.entries(ACTION_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <button type="submit" className="focus-ring rounded-lg border border-border-subtle px-3 py-1.5 text-sm text-muted hover:text-foreground">Apply</button>
      </form>

      <Card>
        {!result.ok ? (
          <Notice tone="error">The audit log could not be loaded: {result.error}</Notice>
        ) : result.rows.length === 0 ? (
          <EmptyState title="No entries" />
        ) : (
          <>
            <div className="-mx-5 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-xs text-muted-dim">
                  <tr className="border-b border-border-subtle">
                    <th scope="col" className="px-5 py-2 font-medium">When</th>
                    <th scope="col" className="px-3 py-2 font-medium">Who</th>
                    <th scope="col" className="px-5 py-2 font-medium">What</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {result.rows.map((r) => (
                    <tr key={r.id}>
                      <td className="whitespace-nowrap px-5 py-2.5 text-xs text-muted-dim">{formatDateTime(r.created_at)}</td>
                      <td className="max-w-[14rem] truncate px-3 py-2.5 text-muted" title={r.actor}>{r.actor}</td>
                      <td className={cn("px-5 py-2.5", r.action.startsWith("login_") ? "text-gold-bright" : "text-foreground/90")}>{describeAction(r)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={page}
              pageSize={30}
              total={result.total}
              hrefFor={(n) => `/admin/audit?${new URLSearchParams({ ...(action && { action }), page: String(n) })}`}
            />
          </>
        )}
      </Card>
    </>
  );
}
