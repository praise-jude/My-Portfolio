"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { HeroBackground } from "@/components/effects/hero-background";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { site } from "@/lib/data";

const nameWords = site.name.split(" ");

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const word: Variants = {
  hidden: { opacity: 0, y: "110%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden pt-24"
    >
      <HeroBackground />

      <div className="container-edge relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted"
        >
          <Sparkles size={13} className="text-electric-bright" />
          Founder &amp; Software Engineer
        </motion.div>

        <h1 className="max-w-5xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl md:text-8xl">
          <motion.span
            variants={container}
            initial="hidden"
            animate="visible"
            className="block"
          >
            {nameWords.map((w, i) => (
              <span key={w} className="mr-4 inline-block overflow-hidden align-top last:mr-0 sm:mr-6">
                <motion.span
                  variants={word}
                  className={
                    i === nameWords.length - 1
                      ? "inline-block text-gradient-accent"
                      : "inline-block text-gradient"
                  }
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted sm:text-xl"
        >
          {site.statement}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Magnetic>
            <Button size="lg" asChild>
              <a href="#work">
                View my work
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button size="lg" variant="secondary" asChild>
              <a href="#contact">Start a project</a>
            </Button>
          </Magnetic>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="focus-ring absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted"
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
