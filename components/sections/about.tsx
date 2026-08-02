import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { aboutTimeline } from "@/lib/data";

export function About() {
  return (
    <section id="about" className="relative py-28 sm:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="About"
          title="Why I build software"
          description="Not a resume. A short walk through how I think about the craft — and why every decision downstream of it looks the way it does."
        />

        <div className="relative mt-16">
          <div
            aria-hidden
            className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-electric/60 via-border-strong to-transparent sm:block"
          />

          <StaggerGroup className="flex flex-col gap-6" stagger={0.12}>
            {aboutTimeline.map((item, i) => (
              <StaggerItem key={item.title}>
                <div className="group relative flex gap-6 rounded-2xl border border-border-subtle bg-surface/40 p-6 pl-8 transition-colors duration-300 hover:border-border-strong sm:pl-10">
                  <div
                    aria-hidden
                    className="absolute left-[13px] top-8 hidden size-2.5 rounded-full bg-electric-bright shadow-[0_0_10px_2px_rgba(96,165,250,0.6)] sm:block"
                  />
                  <span className="shrink-0 font-mono text-xs font-medium tracking-widest text-muted-dim">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-electric-bright">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="max-w-2xl text-pretty leading-relaxed text-muted">
                      {item.body}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <Reveal delay={0.1} className="mt-14">
          <blockquote className="border-l-2 border-electric-bright/60 pl-6 text-xl font-medium leading-relaxed text-foreground/90 sm:text-2xl">
            &ldquo;I don&apos;t just write code — I design, architect, and ship
            software that real businesses depend on.&rdquo;
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
