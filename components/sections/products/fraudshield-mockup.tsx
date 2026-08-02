"use client";

import { motion } from "framer-motion";
import { ShieldCheck, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const nodes = [
  { x: 30, y: 40 },
  { x: 90, y: 20 },
  { x: 150, y: 55 },
  { x: 60, y: 95 },
  { x: 130, y: 110 },
  { x: 195, y: 85 },
  { x: 20, y: 130 },
];

const edges: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 4],
  [4, 5],
  [2, 5],
  [3, 6],
];

const feed = [
  { label: "Login from new device", risk: "Medium", tone: "amber" as const },
  { label: "Card verification passed", risk: "Low", tone: "emerald" as const },
  { label: "Velocity anomaly detected", risk: "High", tone: "red" as const },
];

const TRUST_SCORE = 92;
const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function FraudShieldMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="glass-strong noise-overlay relative overflow-hidden rounded-2xl p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald/15 text-emerald-bright">
              <ShieldCheck size={14} />
            </span>
            <p className="text-sm font-semibold text-foreground">
              Risk Monitor
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald/10 px-2.5 py-1 text-[10px] font-medium text-emerald-bright">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-bright" />
            Live
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-5">
          {/* network graph */}
          <div className="relative rounded-xl border border-border-subtle bg-white/[0.02] p-3 sm:col-span-3">
            <svg viewBox="0 0 220 150" className="h-40 w-full sm:h-48">
              {edges.map(([a, b], i) => (
                <motion.line
                  key={i}
                  x1={nodes[a].x}
                  y1={nodes[a].y}
                  x2={nodes[b].x}
                  y2={nodes[b].y}
                  stroke="rgba(52,211,153,0.35)"
                  strokeWidth={1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.05 * i, ease: "easeOut" }}
                />
              ))}
              {nodes.map((n, i) => (
                <g key={i}>
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    r={i === 2 ? 6 : 4}
                    fill={i === 2 ? "#34d399" : "#10b981"}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.06 * i }}
                  />
                  {i === 2 && (
                    <motion.circle
                      cx={n.x}
                      cy={n.y}
                      r={6}
                      fill="none"
                      stroke="#34d399"
                      strokeWidth={1}
                      initial={{ opacity: 0.6, scale: 1 }}
                      animate={{ opacity: 0, scale: 2.4 }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* trust score */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-white/[0.02] p-4 sm:col-span-2">
            <div className="relative flex size-24 items-center justify-center">
              <svg viewBox="0 0 100 100" className="size-24 -rotate-90">
                <circle
                  cx={50}
                  cy={50}
                  r={RADIUS}
                  fill="none"
                  stroke="rgba(245,245,247,0.08)"
                  strokeWidth={7}
                />
                <motion.circle
                  cx={50}
                  cy={50}
                  r={RADIUS}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth={7}
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  initial={{ strokeDashoffset: CIRCUMFERENCE }}
                  whileInView={{
                    strokeDashoffset:
                      CIRCUMFERENCE - (TRUST_SCORE / 100) * CIRCUMFERENCE,
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-semibold text-foreground">
                  {TRUST_SCORE}
                </span>
                <span className="text-[9px] uppercase tracking-wide text-muted-dim">
                  Trust
                </span>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-muted-dim">
              Composite score across 120+ signals
            </p>
          </div>
        </div>

        {/* live feed */}
        <div className="mt-4 flex flex-col gap-2">
          {feed.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg border border-border-subtle bg-white/[0.015] px-3 py-2 text-xs"
            >
              <span className="flex items-center gap-2 text-foreground/85">
                {item.tone === "red" ? (
                  <TriangleAlert size={12} className="text-red-400" />
                ) : (
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      item.tone === "emerald" ? "bg-emerald-bright" : "bg-amber-300"
                    )}
                  />
                )}
                {item.label}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium",
                  item.tone === "emerald" && "bg-emerald/10 text-emerald-bright",
                  item.tone === "amber" && "bg-amber-400/10 text-amber-300",
                  item.tone === "red" && "bg-red-400/10 text-red-400"
                )}
              >
                {item.risk}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
