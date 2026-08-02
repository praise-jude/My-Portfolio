import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { DynamicIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { royalInventra, fraudShield } from "@/lib/data";

type Product = typeof royalInventra | typeof fraudShield;

type ProductSectionProps = {
  product: Product;
  mockup: ReactNode;
  reverse?: boolean;
};

const accentText: Record<Product["accent"], string> = {
  electric: "text-electric-bright",
  emerald: "text-emerald-bright",
};

const accentBorder: Record<Product["accent"], string> = {
  electric: "hover:border-electric/40",
  emerald: "hover:border-emerald/40",
};

export function ProductSection({ product, mockup, reverse }: ProductSectionProps) {
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
            <Badge accent={product.accent}>{product.tagline}</Badge>
          </Reveal>
          <Reveal delay={0.05}>
            <h3 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {product.name}
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-lg text-pretty leading-relaxed text-muted">
              {product.description}
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
            <a
              href="#contact"
              className={cn(
                "focus-ring group mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground"
              )}
            >
              Discuss a project like this
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </Reveal>
        </div>

        <div className="relative">{mockup}</div>
      </div>
    </div>
  );
}
