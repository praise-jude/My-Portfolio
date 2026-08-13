"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const pairs = [
  { label: "EUR/USD", value: "1.15212", tone: "up" as const },
  { label: "GBP/USD", value: "1.34878", tone: "up" as const },
  { label: "USD/JPY", value: "159.454", tone: "up" as const },
  { label: "XAU/USD", value: "4398.141", tone: "down" as const },
  { label: "BTC/USD", value: "63,543.72", tone: "up" as const, active: true },
];

const candles = [
  { h: 38, tone: "up" as const },
  { h: 30, tone: "up" as const },
  { h: 14, tone: "up" as const },
  { h: 8, tone: "down" as const },
  { h: 48, tone: "up" as const },
  { h: 20, tone: "up" as const },
  { h: 34, tone: "down" as const },
];

export function ForexAIMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="glass-strong noise-overlay relative overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-300/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
          <div className="ml-3 flex h-6 flex-1 items-center gap-2 rounded-md bg-white/5 px-2.5 text-[11px] text-muted">
            <Search size={11} />
            app.forex-ai.io/dashboard
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {/* stat row */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              { label: "Markets", value: "10" },
              { label: "Active signals", value: "0" },
              { label: "Waiting setups", value: "7" },
              { label: "Blocked by news", value: "0" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border-subtle bg-white/[0.02] p-2.5"
              >
                <p className="text-[9px] uppercase tracking-wide text-muted-dim">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-5">
            {/* pairs list */}
            <div className="hidden rounded-lg border border-border-subtle sm:col-span-1 sm:block">
              {pairs.map((pair) => (
                <div
                  key={pair.label}
                  className={cn(
                    "flex items-center justify-between border-b border-border-subtle px-2.5 py-2 text-[10px] last:border-b-0",
                    pair.active && "bg-emerald/10"
                  )}
                >
                  <span
                    className={cn(
                      "font-medium",
                      pair.active ? "text-emerald-bright" : "text-foreground/80"
                    )}
                  >
                    {pair.label}
                  </span>
                  <span
                    className={cn(
                      pair.tone === "up" ? "text-emerald-bright" : "text-red-400"
                    )}
                  >
                    {pair.value}
                  </span>
                </div>
              ))}
            </div>

            {/* chart + signal */}
            <div className="rounded-lg border border-border-subtle p-3 sm:col-span-4">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">
                  BTC/USD
                </p>
                <div className="flex gap-1 text-[9px]">
                  {["15m", "30m", "1h"].map((tf, i) => (
                    <span
                      key={tf}
                      className={cn(
                        "rounded px-1.5 py-0.5",
                        i === 0
                          ? "bg-emerald/20 text-emerald-bright"
                          : "text-muted-dim"
                      )}
                    >
                      {tf}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[9px] font-medium text-amber-bright">
                  NO TRADE
                </span>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-muted-dim">
                  Range
                </span>
              </div>
              <p className="mb-3 text-[10px] leading-relaxed text-muted-dim">
                Market regime: Range. A setup formed, but the daily/4-hour/1-hour
                trend doesn&apos;t agree — all three must align for a signal.
              </p>

              <div className="flex h-20 items-end gap-1.5">
                {candles.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${c.h * 1.8}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.04 * i,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={cn(
                      "flex-1 rounded-[2px]",
                      c.tone === "up" ? "bg-emerald-bright/80" : "bg-red-400/70"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* open positions */}
          <div className="mt-3 flex items-center justify-between rounded-lg border border-border-subtle bg-white/[0.02] px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-red-400/10 px-2 py-0.5 text-[9px] font-semibold text-red-400">
                SHORT
              </span>
              <span className="text-[11px] text-foreground/85">BTC/USD</span>
              <span className="text-[10px] text-muted-dim">0.01 lots</span>
            </div>
            <span className="text-[11px] font-medium text-emerald-bright">
              +0.12
            </span>
          </div>
        </div>
      </div>

      {/* floating AI badge */}
      <motion.div
        initial={{ opacity: 0, y: 20, x: -10 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="glass animate-float absolute -bottom-6 -left-4 hidden items-center gap-2 rounded-xl px-3.5 py-2.5 shadow-xl sm:flex"
      >
        <span className="flex size-7 items-center justify-center rounded-lg bg-emerald/20 text-emerald-bright">
          <Search size={14} />
        </span>
        <div>
          <p className="text-[11px] font-medium text-foreground">
            Confluence check
          </p>
          <p className="text-[10px] text-muted-dim">D1 · H4 · H1 aligned</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
