"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Search,
  Settings,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const bars = [38, 56, 44, 72, 60, 84, 68, 92, 76, 58, 88, 70];

const rows = [
  { name: "Wireless Charger Pad", qty: 214, status: "In stock", tone: "emerald" as const },
  { name: "Studio Headphones", qty: 18, status: "Low stock", tone: "amber" as const },
  { name: "USB-C Cable 2m", qty: 540, status: "In stock", tone: "emerald" as const },
];

const sidebarIcons = [LayoutDashboard, Boxes, UsersRound, BarChart3, Settings];

export function RoyalInventraMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 4 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
      style={{ perspective: 1200 }}
    >
      <div className="glass-strong noise-overlay relative overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-300/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
          <div className="ml-3 flex h-6 flex-1 items-center gap-2 rounded-md bg-white/5 px-2.5 text-[11px] text-muted">
            <Search size={11} />
            app.royalinventra.com/dashboard
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
                  i === 0
                    ? "bg-electric/20 text-electric-bright"
                    : "text-muted-dim"
                )}
              >
                <Icon size={16} strokeWidth={1.75} />
              </div>
            ))}
          </div>

          {/* main */}
          <div className="flex-1 p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Overview</p>
                <p className="text-xs text-muted-dim">Last 30 days · all locations</p>
              </div>
              <span className="glass rounded-full px-3 py-1 text-[11px] text-muted">
                This month
              </span>
            </div>

            {/* stat cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Revenue", value: "$48.2k", delta: "+12.4%" },
                { label: "Orders", value: "1,284", delta: "+6.1%" },
                { label: "Inventory", value: "$212k", delta: "+2.8%" },
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
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-emerald-bright">
                    <TrendingUp size={10} />
                    {stat.delta}
                  </p>
                </div>
              ))}
            </div>

            {/* chart */}
            <div className="mt-4 rounded-xl border border-border-subtle bg-white/[0.02] p-4">
              <div className="flex h-24 items-end gap-1.5">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.7,
                      delay: 0.03 * i,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={cn(
                      "flex-1 rounded-t-sm",
                      i === 7
                        ? "bg-gradient-to-t from-electric to-electric-bright"
                        : "bg-white/10"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* table */}
            <div className="mt-4 hidden overflow-hidden rounded-xl border border-border-subtle sm:block">
              {rows.map((row, i) => (
                <div
                  key={row.name}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 text-xs",
                    i !== rows.length - 1 && "border-b border-border-subtle"
                  )}
                >
                  <span className="text-foreground/90">{row.name}</span>
                  <span className="text-muted-dim">{row.qty} units</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      row.tone === "emerald"
                        ? "bg-emerald/10 text-emerald-bright"
                        : "bg-amber-400/10 text-amber-300"
                    )}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* floating AI assistant chip */}
      <motion.div
        initial={{ opacity: 0, y: 20, x: -10 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="glass animate-float absolute -bottom-6 -left-4 hidden items-center gap-2 rounded-xl px-3.5 py-2.5 shadow-xl sm:flex"
      >
        <span className="flex size-7 items-center justify-center rounded-lg bg-electric/20 text-electric-bright">
          <BarChart3 size={14} />
        </span>
        <div>
          <p className="text-[11px] font-medium text-foreground">AI Insight</p>
          <p className="text-[10px] text-muted-dim">Stock reorder suggested</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
