import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { DynamicIcon } from "@/lib/icons";
import { philosophy } from "@/lib/data";

export function Philosophy() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="How I Work"
          title="Development philosophy"
          description="Principles that shape every technical decision, not just the ones anyone sees."
        />

        <StaggerGroup
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.06}
        >
          {philosophy.map((item) => (
            <StaggerItem key={item.title}>
              <GlassCard className="h-full">
                <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-white/[0.04] text-electric-bright">
                  <DynamicIcon name={item.icon} size={18} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
