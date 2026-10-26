"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  // Page links are active by route; homepage section links by scroll position.
  const active =
    pathname === "/"
      ? activeSection
      : (navLinks.find(
          (l) => !l.href.includes("#") && (pathname === l.href || pathname.startsWith(`${l.href}/`))
        )?.href ?? "");

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = navLinks
      .filter((l) => l.href.startsWith("/#"))
      .map((l) => document.getElementById(l.href.slice(2)))
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`/#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5">
        <motion.nav
          animate={{
            width: scrolled ? "min(760px, 92vw)" : "min(920px, 94vw)",
            paddingBlock: scrolled ? "0.55rem" : "0.75rem",
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "glass flex items-center justify-between rounded-full px-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] sm:px-6"
          )}
        >
          <Link
            href="/"
            aria-label="Jude Omini Ewah — home"
            className="focus-ring shrink-0 rounded-full text-sm font-semibold tracking-tight text-foreground"
          >
            J<span className="text-gold-bright">.</span>Ewah
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active === link.href ? "page" : undefined}
                  className={cn(
                    "focus-ring relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground",
                    active === link.href && "text-foreground"
                  )}
                >
                  {link.label}
                  {active === link.href && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-0.5 h-px bg-gold-bright"
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden shrink-0 md:block">
            <Button asChild variant="secondary" size="sm">
              <Link href="/contact">Let&apos;s talk</Link>
            </Button>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="focus-ring flex size-9 items-center justify-center rounded-full text-foreground md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-background md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="focus-ring block rounded-full px-6 py-4 text-2xl font-medium text-foreground/90 transition-colors hover:text-gold-bright"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * navLinks.length, duration: 0.4 }}
              className="mt-6"
            >
              <Button variant="primary" size="lg" asChild>
                <Link href="/contact" onClick={() => setOpen(false)}>
                  Let&apos;s talk
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
