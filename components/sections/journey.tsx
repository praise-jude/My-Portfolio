import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { JourneyLine } from "@/components/sections/journey-line";
import { experienceTimeline } from "@/lib/data";

export function Journey() {
  return (
    <section id="journey" className="relative py-28 sm:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Journey"
          title="From learning to leading products"
          description="The path from writing my first lines of code to founding and shipping platforms businesses run on."
        />

        <div className="mt-16">
          <JourneyLine>
            <div className="flex flex-col gap-10">
              {experienceTimeline.map((step, i) => (
                <Reveal key={step.phase} delay={i * 0.05}>
                  <div className="relative flex gap-6 pl-0 sm:pl-12">
                    <span
                      aria-hidden
                      className="absolute left-[9px] top-1.5 hidden size-3.5 rounded-full border-2 border-background bg-electric-bright shadow-[0_0_0_4px_rgba(59,130,246,0.15)] sm:block"
                    />
                    <div className="flex w-full flex-col gap-2 rounded-2xl border border-border-subtle bg-surface/40 p-6 transition-colors duration-300 hover:border-border-strong sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-xs font-medium uppercase tracking-[0.2em] text-electric-bright">
                            {step.phase}
                          </span>
                          <span className="text-xs text-muted-dim">
                            · {step.period}
                          </span>
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
