"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const categoryStyle: Record<string, string> = {
  Frontend: "group-hover:text-electric-bright group-hover:border-electric/40",
  Backend: "group-hover:text-electric-bright group-hover:border-electric/40",
  Language: "group-hover:text-foreground group-hover:border-border-strong",
  Data: "group-hover:text-emerald-bright group-hover:border-emerald/40",
  AI: "group-hover:text-emerald-bright group-hover:border-emerald/40",
  Security: "group-hover:text-emerald-bright group-hover:border-emerald/40",
  Infra: "group-hover:text-foreground group-hover:border-border-strong",
};

export function SkillTile({ name, category }: { name: string; category: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 260, damping: 20 });
  const sry = useSpring(ry, { stiffness: 260, damping: 20 });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 16);
    rx.set(py * -16);
  }

  function handleLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 600 }}
      className="group relative flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border border-border-subtle bg-surface/50 p-3 text-center transition-colors duration-300 sm:aspect-auto sm:h-28"
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl border border-transparent transition-colors duration-300",
          categoryStyle[category]
        )}
      />
      <span className="relative text-[10px] uppercase tracking-widest text-muted-dim">
        {category}
      </span>
      <span className="relative text-sm font-medium text-foreground sm:text-base">
        {name}
      </span>
    </motion.div>
  );
}
