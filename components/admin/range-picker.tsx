import Link from "next/link";
import type { DateRange } from "@/lib/analytics/range";
import { cn } from "@/lib/utils";
import { inputClass } from "./form-styles";

const presets = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
];

/** Plain links + a GET form: works without client JavaScript. */
export function RangePicker({ basePath, range }: { basePath: string; range: DateRange }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="flex flex-wrap gap-1 rounded-xl border border-border-subtle bg-surface/60 p-1" role="group" aria-label="Date range">
        {presets.map((p) => (
          <Link
            key={p.key}
            href={`${basePath}?range=${p.key}`}
            aria-current={range.key === p.key ? "true" : undefined}
            className={cn(
              "focus-ring rounded-lg px-3 py-1.5 text-sm transition-colors",
              range.key === p.key ? "bg-gold/15 text-gold-bright" : "text-muted hover:text-foreground"
            )}
          >
            {p.label}
          </Link>
        ))}
      </div>
      <form action={basePath} method="get" className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="range" value="custom" />
        <label className="sr-only" htmlFor="range-from">
          From
        </label>
        <input id="range-from" type="date" name="from" defaultValue={range.fromDay} className={cn(inputClass, "w-auto py-1.5")} />
        <span className="text-xs text-muted-dim">to</span>
        <label className="sr-only" htmlFor="range-to">
          To
        </label>
        <input id="range-to" type="date" name="to" defaultValue={range.toDay} className={cn(inputClass, "w-auto py-1.5")} />
        <button
          type="submit"
          className={cn(
            "focus-ring rounded-lg border px-3 py-1.5 text-sm transition-colors",
            range.key === "custom" ? "border-gold/40 text-gold-bright" : "border-border-subtle text-muted hover:text-foreground"
          )}
        >
          Apply
        </button>
      </form>
    </div>
  );
}
