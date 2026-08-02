import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { testimonials } from "@/lib/data";

export function Testimonials() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Feedback"
          title="What early users are saying"
          description="Sample testimonials representing the kind of feedback these products are built for — shown here until replaced with verified customer quotes."
        />

        <StaggerGroup
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2"
          stagger={0.07}
        >
          {testimonials.map((t) => (
            <StaggerItem key={t.quote}>
              <GlassCard className="flex h-full flex-col justify-between gap-6" glow={false}>
                <Quote size={22} className="text-electric-bright/70" />
                <p className="text-pretty text-base leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <Badge accent="neutral" className="w-fit">
                  {t.label}
                </Badge>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <p className="mt-6 text-center text-xs text-muted-dim">
          Sample testimonials — will be replaced with verified customer quotes.
        </p>
      </div>
    </section>
  );
}
