"use client";

import { motion } from "framer-motion";
import {
  Ban,
  Bell,
  FileText,
  FolderKanban,
  Gauge,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarIcons = [
  ShieldCheck,
  Search,
  FolderKanban,
  SlidersHorizontal,
  Ban,
  FileText,
];

const feed = [
  { label: "Customer A", meta: "Nigeria · Web · Chrome", amount: "₦1,729,089", status: "Medium", tone: "amber" as const },
  { label: "Customer B", meta: "Unknown (VPN) · Android", amount: "₦616,118", status: "Blocked", tone: "red" as const },
  { label: "Customer C", meta: "Nigeria · Android", amount: "₦2,101,753", status: "Medium", tone: "amber" as const },
];

const regions = [
  { label: "Unknown (VPN)", count: 9, pct: 100 },
  { label: "Ghana", count: 3, pct: 33 },
  { label: "Russia", count: 2, pct: 22 },
  { label: "Nigeria", count: 1, pct: 11 },
];

export function FraudShieldMockup() {
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
            app.fraudshield.ai/overview
          </div>
        </div>

        <div className="flex">
          {/* sidebar */}
          <div className="hidden w-14 flex-col items-center gap-4 border-r border-border-subtle py-5 sm:flex">
            {sidebarIcons.map((Icon, i) => (
              <div
                key={i}
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg",
                  i === 0 ? "bg-amber/20 text-amber-bright" : "text-muted-dim"
                )}
              >
                <Icon size={16} strokeWidth={1.75} />
              </div>
            ))}
          </div>

          {/* main */}
          <div className="flex-1 p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Overview</p>
              <div className="flex items-center gap-2 text-muted-dim">
                <Bell size={14} />
                <span className="flex size-6 items-center justify-center rounded-full bg-amber/20 text-[10px] font-semibold text-amber-bright">
                  JO
                </span>
              </div>
            </div>

            {/* stat cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Transactions", value: "60", sub: "Last 24h" },
                { label: "Safe", value: "16", sub: "27% of total" },
                { label: "Blocked", value: "12", sub: "Auto-blocked" },
                { label: "Prevented", value: "$14,739", sub: "Est. savings" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border-subtle bg-white/[0.02] p-3"
                >
                  <p className="text-[10px] uppercase tracking-wide text-muted-dim">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground sm:text-lg">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-dim">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* live feed */}
            <div className="mt-4 rounded-xl border border-border-subtle">
              <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2">
                <p className="text-[11px] font-medium text-foreground">
                  Live Transaction Feed
                </p>
                <span className="flex items-center gap-1.5 text-[10px] text-amber-bright">
                  <span className="size-1.5 animate-pulse rounded-full bg-amber-bright" />
                  Live
                </span>
              </div>
              {feed.map((row, i) => (
                <div
                  key={row.label}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-[11px]",
                    i !== feed.length - 1 && "border-b border-border-subtle"
                  )}
                >
                  <div>
                    <p className="text-foreground/90">{row.label}</p>
                    <p className="text-[10px] text-muted-dim">{row.meta}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-dim">{row.amount}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium",
                        row.tone === "amber"
                          ? "bg-amber/10 text-amber-bright"
                          : "bg-red-400/10 text-red-400"
                      )}
                    >
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* top risk regions */}
            <div className="mt-4 hidden rounded-xl border border-border-subtle p-3 sm:block">
              <p className="mb-2.5 text-[11px] font-medium text-foreground">
                Top Risk Regions
              </p>
              <div className="flex flex-col gap-2">
                {regions.map((region, i) => (
                  <div key={region.label}>
                    <div className="mb-1 flex items-center justify-between text-[10px]">
                      <span className="text-foreground/80">{region.label}</span>
                      <span className="text-muted-dim">{region.count} flagged</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${region.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.05 * i }}
                        className="h-full rounded-full bg-gradient-to-r from-amber to-amber-bright"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* floating risk badge */}
      <motion.div
        initial={{ opacity: 0, y: 20, x: -10 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="glass animate-float absolute -bottom-6 -left-4 hidden items-center gap-2 rounded-xl px-3.5 py-2.5 shadow-xl sm:flex"
      >
        <span className="flex size-7 items-center justify-center rounded-lg bg-amber/20 text-amber-bright">
          <Gauge size={14} />
        </span>
        <div>
          <p className="text-[11px] font-medium text-foreground">Risk Score</p>
          <p className="text-[10px] text-muted-dim">Live across every event</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
