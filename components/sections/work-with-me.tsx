import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";

type WorkWithMeProps = {
  intro: string;
  items: Record<string, string>[];
  availability: string;
};

export function WorkWithMe({ intro, items, availability }: WorkWithMeProps) {
  return (
    <section id="work-with-me" className="relative py-28 sm:py-36">
      <div className="container-edge">
        <SectionHeading eyebrow="Work With Me" title="Let's build something together" description={intro} />

        {items.length ? (
          <StaggerGroup className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border-subtle bg-border-subtle sm:grid-cols-2" stagger={0.06}>
            {items.map((item) => (
              <StaggerItem key={item.title} className="h-full">
                <div className="h-full bg-surface p-7 transition-colors duration-300 hover:bg-surface-raised">
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : null}

        <Reveal className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          {availability ? <p className="text-sm text-muted">{availability}</p> : <span />}
          <Button asChild>
            <Link href="/contact?subject=Working%20together">
              Start a conversation
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
