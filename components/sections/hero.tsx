"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { HeroBackground } from "@/components/effects/hero-background";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { site } from "@/lib/data";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const line: Variants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

type HeroProps = {
  eyebrow: string;
  headline: string;
  intro: string;
};

/** Splits "A. B. C." into one animated line per sentence. */
function sentences(text: string) {
  const parts = text.match(/[^.!?]+[.!?]*/g)?.map((s) => s.trim()).filter(Boolean);
  return parts?.length ? parts : [text];
}

export function Hero({ eyebrow, headline, intro }: HeroProps) {
  const lines = sentences(headline);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden pb-24 pt-32"
    >
      <HeroBackground />

      <div className="container-edge relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass mb-8 inline-flex max-w-full items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted sm:text-xs"
        >
          <Sparkles size={13} className="shrink-0 text-gold-bright" />
          <span className="truncate">
            {site.name}
            {eyebrow ? <span className="hidden sm:inline"> · {eyebrow}</span> : null}
          </span>
        </motion.div>

        <h1 className="max-w-5xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight xs:text-5xl sm:text-6xl md:text-7xl">
          <motion.span variants={container} initial="hidden" animate="visible" className="block">
            {lines.map((text, i) => (
              <span key={`${i}-${text}`} className="block overflow-hidden pb-1">
                <motion.span
                  variants={line}
                  className={
                    i === lines.length - 1
                      ? "inline-block text-gradient-gold"
                      : "inline-block text-gradient"
                  }
                >
                  {text}
                </motion.span>
              </span>
            ))}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
        >
          {intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex w-full flex-col items-stretch gap-3 xs:w-auto sm:flex-row sm:items-center sm:gap-4"
        >
          <Magnetic>
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/projects">
                Explore My Projects
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
              <Link href="/#work-with-me">Work With Me</Link>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button size="lg" variant="ghost" asChild className="w-full sm:w-auto">
              <Link href="/contact">Contact Me</Link>
            </Button>
          </Magnetic>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="focus-ring absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted sm:flex"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.25em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} />
        </motion.span>
      </motion.a>
    </section>
  );
}
