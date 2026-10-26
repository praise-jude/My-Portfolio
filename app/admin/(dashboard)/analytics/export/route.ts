import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { resolveRange } from "@/lib/analytics/range";
import { analyticsTimezone, getRangeSummary } from "@/lib/analytics/queries";
import { summaryToCsv } from "@/lib/analytics/aggregate";
import { rateLimit } from "@/lib/security/rate-limit";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  if (!(await rateLimit(`export:${admin.id}`, 60, 10))) {
    return NextResponse.json({ error: "Too many exports. Try again in a minute." }, { status: 429 });
  }

  const p = request.nextUrl.searchParams;
  const range = resolveRange(
    { range: p.get("range") ?? undefined, from: p.get("from") ?? undefined, to: p.get("to") ?? undefined },
    new Date(),
    analyticsTimezone()
  );
  const result = await getRangeSummary(range);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 503 });

  await logAudit({
    actor: admin.email,
    action: "analytics_export",
    details: { from: range.fromDay, to: range.toDay },
  });

  return new NextResponse(summaryToCsv(result.summary, `${range.fromDay} to ${range.toDay}`), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="visitor-summary-${range.fromDay}-to-${range.toDay}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
