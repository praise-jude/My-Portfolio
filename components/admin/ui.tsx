import Link from "next/link";
import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageTitle({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({
  title,
  description,
  children,
  className,
  actions,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <section className={cn("rounded-2xl border border-border-subtle bg-surface/60 p-5", className)}>
      {title ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            {description ? <p className="mt-0.5 text-xs text-muted-dim">{description}</p> : null}
          </div>
          {actions}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string | null;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface/60 p-5">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-foreground">
        {value === null ? <span className="text-muted-dim">—</span> : typeof value === "number" ? value.toLocaleString("en-US") : value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-dim">{hint}</p> : null}
    </div>
  );
}

export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "success" | "warning" | "error";
  children: ReactNode;
}) {
  const styles = {
    info: "border-electric/30 bg-electric/5 text-electric-bright",
    success: "border-emerald/30 bg-emerald/5 text-emerald-bright",
    warning: "border-gold/30 bg-gold/5 text-gold-bright",
    error: "border-red-500/30 bg-red-500/5 text-red-300",
  }[tone];
  const Icon = tone === "success" ? CheckCircle2 : tone === "info" ? Info : AlertTriangle;
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("flex gap-3 rounded-xl border px-4 py-3 text-sm", styles)}>
      <Icon size={16} className="mt-0.5 shrink-0" aria-hidden />
      <div className="text-foreground/90">{children}</div>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong px-6 py-10 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {children ? <div className="mt-1.5 max-w-sm text-xs text-muted">{children}</div> : null}
    </div>
  );
}

export function BarList({ items, emptyText = "No data yet." }: { items: { label: string; count: number }[]; emptyText?: string }) {
  if (!items.length) return <p className="py-4 text-sm text-muted-dim">{emptyText}</p>;
  const max = Math.max(...items.map((i) => i.count));
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item) => (
        <li key={item.label} className="relative overflow-hidden rounded-md px-2.5 py-1.5 text-sm">
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 rounded-md bg-gold/10"
            style={{ width: `${Math.max(4, (item.count / max) * 100)}%` }}
          />
          <span className="relative flex items-center justify-between gap-3">
            <span className="truncate text-foreground/90" title={item.label}>
              {item.label}
            </span>
            <span className="shrink-0 tabular-nums text-muted">{item.count.toLocaleString("en-US")}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  hrefFor,
}: {
  page: number;
  pageSize: number;
  total: number;
  hrefFor: (page: number) => string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const link = "focus-ring rounded-lg border border-border-subtle px-3 py-1.5 text-sm transition-colors hover:border-border-strong";
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3 pt-4 text-sm text-muted">
      <span>
        Page {page} of {pages} · {total.toLocaleString("en-US")} total
      </span>
      <span className="flex gap-2">
        {page > 1 ? (
          <Link className={link} href={hrefFor(page - 1)}>
            Previous
          </Link>
        ) : null}
        {page < pages ? (
          <Link className={link} href={hrefFor(page + 1)}>
            Next
          </Link>
        ) : null}
      </span>
    </nav>
  );
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: process.env.SITE_TIMEZONE || "Africa/Lagos",
  }).format(new Date(value));
}

export function pageParam(value: string | string[] | undefined) {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n > 0 && n < 100000 ? n : 1;
}

export function stringParam(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.slice(0, 100) ?? "";
}
