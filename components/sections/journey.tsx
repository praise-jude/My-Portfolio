import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { JourneyLine } from "@/components/sections/journey-line";
type Milestone = { phase: string; period: string; title: string; description: string };

export function Journey({ items }: { items: Milestone[] }) {
  if (!items.length) return null;

  return (
    <section id="journey" className="relative py-28 sm:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Journey"
          title="My entrepreneurial journey"
          description="The path from learning the craft to founding a brand and building products under it."
        />

        <div className="mt-16">
          <JourneyLine>
            <div className="flex flex-col gap-10">
              {items.map((step, i) => (
                <Reveal key={`${step.phase}-${i}`} delay={i * 0.05}>
                  <div className="relative flex gap-6 pl-0 sm:pl-12">
                    <span
                      aria-hidden
                      className="absolute left-[9px] top-1.5 hidden size-3.5 rounded-full border-2 border-background bg-gold-bright shadow-[0_0_0_4px_rgba(201,162,74,0.15)] sm:block"
                    />
                    <div className="flex w-full flex-col gap-2 rounded-2xl border border-border-subtle bg-surface/40 p-6 transition-colors duration-300 hover:border-border-strong sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold-bright">
                            {step.phase}
                          </span>
                          {step.period ? (
                            <span className="text-xs text-muted-dim">
                              · {step.period}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {step.title}
                        </h3>
                        <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-muted sm:text-base">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </JourneyLine>
        </div>
      </div>
    </section>
  );
}
