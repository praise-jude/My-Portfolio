import type { DailyPoint } from "@/lib/analytics/aggregate";

const W = 720;
const H = 220;
const PAD = { top: 16, right: 12, bottom: 28, left: 40 };

function niceMax(value: number) {
  if (value <= 5) return 5;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
}

function shortDay(day: string) {
  const [, m, d] = day.split("-").map(Number);
  return `${d} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1]}`;
}

/**
 * Server-rendered SVG chart of page views (bars) and unique visitors (line).
 * No client JavaScript; a visually hidden table carries the same data for
 * screen readers.
 */
export function TrendChart({ data }: { data: DailyPoint[] }) {
  if (!data.length) return null;
  const max = niceMax(Math.max(...data.map((d) => d.pageviews), 1));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const step = innerW / data.length;
  const barW = Math.max(2, Math.min(28, step * 0.6));
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const x = (i: number) => PAD.left + step * i + step / 2;
  const labelEvery = Math.ceil(data.length / 8);
  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.visitors).toFixed(1)}`).join(" ");

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Daily page views and unique visitors">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(max * t)}
              y2={y(max * t)}
              stroke="currentColor"
              className="text-border-subtle"
              strokeDasharray={t === 0 ? undefined : "3 4"}
            />
            <text x={PAD.left - 8} y={y(max * t) + 4} textAnchor="end" className="fill-muted-dim text-[10px]">
              {Math.round(max * t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => (
          <g key={d.day}>
            <rect
              x={x(i) - barW / 2}
              y={y(d.pageviews)}
              width={barW}
              height={Math.max(0, PAD.top + innerH - y(d.pageviews))}
              rx={2}
              className="fill-gold/45"
            >
              <title>{`${d.day}: ${d.pageviews} page views, ${d.visitors} visitors`}</title>
            </rect>
            {i % labelEvery === 0 ? (
              <text x={x(i)} y={H - 8} textAnchor="middle" className="fill-muted-dim text-[10px]">
                {shortDay(d.day)}
              </text>
            ) : null}
          </g>
        ))}
        <path d={line} fill="none" stroke="currentColor" strokeWidth={2} className="text-electric-bright" />
        {data.length <= 31
          ? data.map((d, i) => <circle key={d.day} cx={x(i)} cy={y(d.visitors)} r={2.5} className="fill-electric-bright" />)
          : null}
      </svg>
      <figcaption className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-sm bg-gold/60" /> Page views
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="h-0.5 w-3 bg-electric-bright" /> Unique visitors
        </span>
      </figcaption>
      <table className="sr-only">
        <caption>Daily traffic</caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>Page views</th>
            <th>Unique visitors</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.day}>
              <td>{d.day}</td>
              <td>{d.pageviews}</td>
              <td>{d.visitors}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
