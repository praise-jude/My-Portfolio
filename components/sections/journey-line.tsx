"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function JourneyLine({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.75", "end 0.55"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <div ref={containerRef} className="relative">
      <div
        aria-hidden
        className="absolute left-[15px] top-1 hidden h-full w-px bg-border-subtle sm:block"
      />
      <motion.div
        aria-hidden
        style={{ scaleY }}
        className="absolute left-[15px] top-1 hidden h-full w-px origin-top bg-gradient-to-b from-electric-bright via-emerald-bright to-electric-bright sm:block"
      />
      {children}
    </div>
  );
}
