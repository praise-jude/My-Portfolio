import Link from "next/link";
import { SmartImage as Image } from "@/components/ui/smart-image";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { aboutTimeline, site } from "@/lib/data";

type AboutProps = {
  summary: string;
  quote: string;
  photoUrl: string;
};

export function About({ summary, quote, photoUrl }: AboutProps) {
  return (
    <section id="about" className="relative py-28 sm:py-36">
      <div className="container-edge">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_auto]">
          <SectionHeading eyebrow="About" title="Why I build" description={summary} />
          {photoUrl ? (
            <Reveal delay={0.1}>
              <div className="relative size-40 overflow-hidden rounded-3xl border border-gold/30 glow-gold sm:size-48">
                <Image
                  src={photoUrl}
                  alt={`Portrait of ${site.name}`}
                  fill
                  sizes="(min-width: 640px) 192px, 160px"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ) : null}
        </div>

        <Reveal delay={0.1} className="mt-8">
          <Link
            href="/about"
            className="focus-ring group inline-flex items-center gap-1.5 text-sm font-medium text-gold-bright"
          >
            Read my story
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-gold/60 via-border-strong to-transparent sm:block"
          />

          <StaggerGroup className="flex flex-col gap-6" stagger={0.12}>
            {aboutTimeline.map((item, i) => (
              <StaggerItem key={item.title}>
                <div className="group relative flex gap-6 rounded-2xl border border-border-subtle bg-surface/40 p-6 pl-8 transition-colors duration-300 hover:border-border-strong sm:pl-10">
                  <div
                    aria-hidden
                    className="absolute left-[13px] top-8 hidden size-2.5 rounded-full bg-gold-bright shadow-[0_0_10px_2px_rgba(232,200,114,0.5)] sm:block"
                  />
                  <span className="shrink-0 font-mono text-xs font-medium tracking-widest text-muted-dim">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold-bright">
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

        {quote ? (
          <Reveal delay={0.1} className="mt-14">
            <blockquote className="border-l-2 border-gold-bright/60 pl-6 text-xl font-medium leading-relaxed text-foreground/90 sm:text-2xl">
              &ldquo;{quote}&rdquo;
            </blockquote>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
