export const DEFAULT_TIMEZONE = "Africa/Lagos";

export type RangeKey = "today" | "7d" | "30d" | "90d" | "custom";

export type DateRange = {
  key: RangeKey;
  from: Date;
  /** Exclusive upper bound. */
  to: Date;
  label: string;
  fromDay: string;
  toDay: string;
};

const DAY_MS = 86_400_000;

/** "YYYY-MM-DD" for the instant as seen in the given timezone. */
export function dayKey(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function tzOffsetMs(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).formatToParts(instant);
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

/** UTC instant of local midnight for a "YYYY-MM-DD" day in the timezone. */
export function startOfDay(day: string, timeZone: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d);
  const first = guess - tzOffsetMs(new Date(guess), timeZone);
  // Second pass corrects for a DST transition between the guess and midnight.
  return new Date(guess - tzOffsetMs(new Date(first), timeZone));
}

export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + n * DAY_MS).toISOString().slice(0, 10);
}

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDay(day: string | undefined): day is string {
  if (!day || !DAY_RE.test(day)) return false;
  const d = new Date(`${day}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === day;
}

/** Inclusive list of day keys from `fromDay` to `toDay`. */
export function daysBetween(fromDay: string, toDay: string): string[] {
  const out: string[] = [];
  for (let d = fromDay; d <= toDay && out.length < 400; d = addDays(d, 1)) out.push(d);
  return out;
}

const PRESETS: Record<Exclude<RangeKey, "custom">, { days: number; label: string }> = {
  today: { days: 1, label: "Today" },
  "7d": { days: 7, label: "Last 7 days" },
  "30d": { days: 30, label: "Last 30 days" },
  "90d": { days: 90, label: "Last 90 days" },
};

export function resolveRange(
  params: { range?: string; from?: string; to?: string },
  now: Date,
  timeZone: string = DEFAULT_TIMEZONE
): DateRange {
  const today = dayKey(now, timeZone);

  if (params.range === "custom" && isValidDay(params.from) && isValidDay(params.to)) {
    let fromDay = params.from;
    let toDay = params.to;
    if (fromDay > toDay) [fromDay, toDay] = [toDay, fromDay];
    if (toDay > today) toDay = today;
    // Cap custom ranges at a year to keep queries bounded.
    if (daysBetween(fromDay, toDay).length > 366) fromDay = addDays(toDay, -365);
    return {
      key: "custom",
      from: startOfDay(fromDay, timeZone),
      to: startOfDay(addDays(toDay, 1), timeZone),
      label: `${fromDay} → ${toDay}`,
      fromDay,
      toDay,
    };
  }

  const key = (params.range && params.range in PRESETS ? params.range : "30d") as Exclude<RangeKey, "custom">;
  const preset = PRESETS[key];
  const fromDay = addDays(today, -(preset.days - 1));
  return {
    key,
    from: startOfDay(fromDay, timeZone),
    to: startOfDay(addDays(today, 1), timeZone),
    label: preset.label,
    fromDay,
    toDay: today,
  };
}
