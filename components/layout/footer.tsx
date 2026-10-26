import Link from "next/link";
import { navLinks, site } from "@/lib/data";
import { SocialLinks } from "@/components/ui/social-links";
import type { SiteContent } from "@/lib/content/queries";

export function Footer({ content }: { content: SiteContent }) {
  return (
    <footer className="relative border-t border-border-subtle py-14">
      <div className="container-edge flex flex-col gap-10">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/"
              className="focus-ring text-2xl font-semibold tracking-tight text-foreground"
            >
              J<span className="text-gold-bright">.</span>Ewah
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              {content.hero.fields.headline}
            </p>
            <p className="mt-2 text-xs text-muted-dim">
              Founder, Royalman Digital Concepts
              {content.contact.fields.location ? ` · ${content.contact.fields.location}` : ""}
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/privacy"
              className="focus-ring text-sm text-muted transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
          </nav>
        </div>

        <div className="flex flex-col-reverse items-center justify-between gap-6 border-t border-border-subtle pt-8 sm:flex-row">
          <p className="text-xs text-muted-dim">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>

          <SocialLinks
            links={content.socials.items.map((s) => ({ label: s.label, url: s.url }))}
            email={content.contact.fields.email}
            itemClassName="size-9 text-muted-dim"
          />
        </div>
      </div>
    </footer>
  );
}
