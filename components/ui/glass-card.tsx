"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  as?: "div" | "article" | "li";
};

export function GlassCard({ children, className, glow = true, as = "div" }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const Comp = as as "div";

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (!glow || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <Comp
      ref={ref}
      onMouseMove={handleMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface/60 p-6 backdrop-blur-xl transition-colors duration-300 hover:border-border-strong",
        className
      )}
    >
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(201,162,74,0.10), transparent 70%)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </Comp>
  );
}
