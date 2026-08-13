"use client";

import { motion } from "framer-motion";
import { Boxes, Eye, Search } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export function InventraMockup() {
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
            app.inventra.io/login
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5">
          {/* left brand panel */}
          <div className="relative col-span-3 overflow-hidden bg-gradient-to-br from-electric to-electric-bright p-6 sm:p-7">
            <div
              aria-hidden
              className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-14 left-10 size-44 rounded-full bg-white/10 blur-2xl"
            />

            <div className="relative flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-white text-electric">
                <Boxes size={15} strokeWidth={2} />
              </span>
              <span className="text-sm font-semibold text-white">Inventra</span>
            </div>

            <p className="relative mt-8 text-xl font-semibold leading-tight text-white sm:text-2xl">
              Inventory that
              <br />
              runs itself.
            </p>
            <p className="relative mt-3 max-w-[26ch] text-xs leading-relaxed text-white/80">
              Real-time stock, supplier orders, and profit analytics for
              modern retail — in one calm, fast workspace.
            </p>

            <div className="relative mt-7 flex gap-5">
              {[
                { label: "uptime", value: 99.98, suffix: "%", decimals: 2 },
                { label: "stores", value: 12, suffix: "k+", decimals: 0 },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-base font-semibold text-white sm:text-lg">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-white/70">
                    {stat.label}
                  </p>
                </div>
              ))}
              <div>
                <p className="text-base font-semibold text-white sm:text-lg">
                  $2.4B
                </p>
                <p className="text-[10px] uppercase tracking-wide text-white/70">
                  tracked
                </p>
              </div>
            </div>

            <p className="relative mt-7 text-[10px] text-white/60">
              Trusted by grocers, pharmacies &amp; wholesalers worldwide.
            </p>
          </div>

          {/* right sign-in panel */}
          <div className="col-span-2 flex flex-col justify-center gap-4 p-6 sm:p-7">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Welcome back
              </p>
              <p className="mt-1 text-[11px] text-muted-dim">
                Sign in to your workspace to continue.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <p className="mb-1 text-[10px] text-muted-dim">Email</p>
                <div className="rounded-lg border border-border-subtle bg-white/[0.02] px-3 py-2 text-[11px] text-muted">
                  ava@freshmart.co
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-[10px] text-muted-dim">Password</p>
                  <p className="text-[10px] text-electric-bright">Forgot?</p>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-white/[0.02] px-3 py-2">
                  <span className="text-[11px] text-muted">••••••••••</span>
                  <Eye size={12} className="text-muted-dim" />
                </div>
              </div>
            </div>

            <button
              type="button"
              tabIndex={-1}
              className="rounded-lg bg-gradient-to-r from-electric to-electric-bright py-2.5 text-[11px] font-medium text-white"
            >
              Sign in →
            </button>

            <p className="text-center text-[10px] text-muted-dim">
              No account?{" "}
              <span className="text-electric-bright">Create one</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
