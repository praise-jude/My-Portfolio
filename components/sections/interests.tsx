import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";

export function Interests({ items }: { items: Record<string, string>[] }) {
  if (!items.length) return null;

  return (
    <section id="interests" className="relative py-28 sm:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Focus Areas"
          title="Technology & business interests"
          description="The spaces I build in — where practical software can change how people work, earn, and do business."
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {items.map((item, i) => (
            <StaggerItem key={item.title} className="h-full">
              <GlassCard className="h-full">
                <span className="font-mono text-xs tracking-widest text-gold-bright">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{item.title}</h3>
                {item.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                ) : null}
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
