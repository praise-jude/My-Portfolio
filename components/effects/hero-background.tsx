"use client";

import { useRef, type PointerEvent } from "react";
import { ParticleField } from "./particle-field";

export function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null);

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--px", `${px}%`);
    ref.current.style.setProperty("--py", `${py}%`);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      style={{ ["--px" as string]: "50%", ["--py" as string]: "38%" }}
    >
      {/* base grid */}
      <div className="absolute inset-0 bg-grid mask-fade-radial opacity-60" />

      {/* mouse-reactive glow mask over the grid */}
      <div
        className="absolute inset-0 bg-grid opacity-90 transition-[background-position] duration-300"
        style={{
          maskImage:
            "radial-gradient(420px circle at var(--px) var(--py), black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(420px circle at var(--px) var(--py), black 0%, transparent 75%)",
        }}
      />

      {/* soft color blobs for depth */}
      <div className="absolute left-[8%] top-[12%] h-[26rem] w-[26rem] animate-pulse-slow rounded-full bg-gold/15 blur-[120px]" />
      <div className="absolute right-[6%] top-[30%] h-[22rem] w-[22rem] animate-float rounded-full bg-electric/15 blur-[130px]" />
      <div className="absolute bottom-[-10%] left-1/3 h-[20rem] w-[20rem] rounded-full bg-electric/10 blur-[140px]" />

      <ParticleField />

      {/* vignette to keep focus centered */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}
