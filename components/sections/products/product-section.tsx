import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { DynamicIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/projects/status-badge";
import type { inventra, fraudShield, forexAI } from "@/lib/data";
import type { Project as ManagedProject } from "@/lib/projects/types";

type Product = typeof inventra | typeof fraudShield | typeof forexAI;

type ProductSectionProps = {
  product: Product;
  mockup: ReactNode;
  reverse?: boolean;
  /** Admin-managed record; its text and links take precedence over the built-in copy. */
  managed?: ManagedProject;
};

const accentText: Record<Product["accent"], string> = {
  electric: "text-electric-bright",
  emerald: "text-emerald-bright",
  amber: "text-amber-bright",
};

const accentBorder: Record<Product["accent"], string> = {
  electric: "hover:border-electric/40",
  emerald: "hover:border-emerald/40",
  amber: "hover:border-amber/40",
};

export function ProductSection({ product, mockup, reverse, managed }: ProductSectionProps) {
  const name = managed?.name ?? product.name;
  const tagline = managed?.tagline ?? product.tagline;
  const description = managed?.description || product.description;

  return (
    <div className="relative py-10">
      <div
        className={cn(
          "grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16",
          reverse && "lg:[&>*:first-child]:order-2"
        )}
      >
        <div className="flex flex-col gap-6">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <Badge accent={product.accent}>{tagline}</Badge>
              {managed ? <StatusBadge status={managed.status} /> : null}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h3 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {name}
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-lg text-pretty leading-relaxed text-muted">
              {description}
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="flex flex-wrap gap-6 border-y border-border-subtle py-5">
              {product.metrics.map((m) => (
                <div key={m.label}>
                  <p
                    className={cn(
                      "text-xl font-semibold sm:text-2xl",
                      accentText[product.accent]
                    )}
                  >
                    {m.value}
                  </p>
                  <p className="text-xs text-muted-dim">{m.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 gap-3 xs:grid-cols-2" stagger={0.05}>
            {product.features.map((feature) => (
              <StaggerItem key={feature.title} y={14}>
                <GlassCard
                  className={cn(
                    "h-full !p-4 transition-transform duration-300 hover:-translate-y-0.5",
                    accentBorder[product.accent]
                  )}
                >
                  <div
                    className={cn(
                      "mb-2.5 inline-flex size-8 items-center justify-center rounded-lg bg-white/[0.04]",
                      accentText[product.accent]
                    )}
                  >
                    <DynamicIcon name={feature.icon} size={16} />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {feature.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-dim">
                    {feature.description}
                  </p>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal delay={0.1}>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
              {managed ? (
                <Link
                  href={`/projects/${managed.slug}`}
                  className="focus-ring group inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gold-bright"
                >
                  Project details
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              ) : null}
              {managed?.website_url ? (
                <a
                  href={managed.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground"
                >
                  Visit website
                  <ExternalLink size={14} />
                </a>
              ) : null}
              <Link
                href="/contact"
                className={cn(
                  "focus-ring group inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
                )}
              >
                Discuss a project like this
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="relative">{mockup}</div>
      </div>
    </div>
  );
}
