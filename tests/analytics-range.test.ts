import { describe, expect, it } from "vitest";
import { dayKey, resolveRange, startOfDay } from "@/lib/analytics/range";

const TZ = "Africa/Lagos";

describe("date ranges", () => {
  // 23:30 UTC on the 25th is 00:30 on the 26th in Lagos.
  const now = new Date("2026-10-25T23:30:00Z");

  it("resolves 'today' in the site timezone", () => {
    const r = resolveRange({ range: "today" }, now, TZ);
    expect(r.fromDay).toBe("2026-10-26");
    expect(r.from.toISOString()).toBe("2026-10-25T23:00:00.000Z");
    expect(r.to.toISOString()).toBe("2026-10-26T23:00:00.000Z");
  });

  it("makes 7d an inclusive seven-day window ending today", () => {
    const r = resolveRange({ range: "7d" }, now, TZ);
    expect([r.fromDay, r.toDay]).toEqual(["2026-10-20", "2026-10-26"]);
  });

  it("defaults to 30 days for unknown or missing ranges", () => {
    expect(resolveRange({}, now, TZ).key).toBe("30d");
    expect(resolveRange({ range: "999d" }, now, TZ).key).toBe("30d");
  });

  it("accepts custom ranges, swapping reversed dates and clamping the future", () => {
    const r = resolveRange({ range: "custom", from: "2026-12-01", to: "2026-10-01" }, now, TZ);
    expect([r.fromDay, r.toDay]).toEqual(["2026-10-01", "2026-10-26"]);
  });

  it("rejects malformed or impossible custom dates", () => {
    expect(resolveRange({ range: "custom", from: "2026-02-30", to: "2026-03-01" }, now, TZ).key).toBe("30d");
    expect(resolveRange({ range: "custom", from: "'; drop", to: "x" }, now, TZ).key).toBe("30d");
  });

  it("caps custom ranges at about a year", () => {
    const r = resolveRange({ range: "custom", from: "2020-01-01", to: "2026-10-26" }, now, TZ);
    expect(r.fromDay).toBe("2025-10-26");
  });

  it("finds local midnight across DST changes", () => {
    // London switches from BST to GMT on 2026-10-25.
    expect(startOfDay("2026-10-25", "Europe/London").toISOString()).toBe("2026-10-24T23:00:00.000Z");
    expect(startOfDay("2026-10-26", "Europe/London").toISOString()).toBe("2026-10-26T00:00:00.000Z");
    expect(dayKey(new Date("2026-10-25T23:30:00Z"), "UTC")).toBe("2026-10-25");
  });
});
