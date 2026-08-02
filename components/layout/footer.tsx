import { navLinks, site, socials } from "@/lib/data";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/social-icons";
import { Mail } from "lucide-react";
import type { ComponentType } from "react";

const socialIcon: Record<string, ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  x: XIcon,
  mail: Mail,
};

export function Footer() {
  return (
    <footer className="relative border-t border-border-subtle py-14">
      <div className="container-edge flex flex-col gap-10">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <a
              href="#top"
              className="focus-ring text-2xl font-semibold tracking-tight text-foreground"
            >
              J<span className="text-electric-bright">.</span>Ewah
            </a>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              {site.statement}
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="focus-ring text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col-reverse items-center justify-between gap-6 border-t border-border-subtle pt-8 sm:flex-row">
          <p className="text-xs text-muted-dim">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {socials.map((s) => {
              const Icon = socialIcon[s.key];
              return (
                <a
                  key={s.key}
                  href={s.href}
                  target={s.key === "mail" ? undefined : "_blank"}
                  rel={s.key === "mail" ? undefined : "noopener noreferrer"}
                  aria-label={s.label}
                  className="focus-ring flex size-9 items-center justify-center rounded-full text-muted-dim transition-colors hover:text-electric-bright"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
