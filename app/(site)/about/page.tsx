import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Interests } from "@/components/sections/interests";
import { Journey } from "@/components/sections/journey";
import { Expertise } from "@/components/sections/expertise";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SmartImage } from "@/components/ui/smart-image";
import { getContent } from "@/lib/content/queries";
import { site } from "@/lib/data";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getContent();
  return {
    title: "About",
    description: about.fields.summary.slice(0, 300),
    alternates: { canonical: "/about" },
    openGraph: { url: `${site.url}/about`, title: `About — ${site.name}` },
  };
}

export default async function AboutPage() {
  const content = await getContent();
  const { body, photoUrl, quote } = content.about.fields;
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <PageHeader eyebrow="About me" title={site.name} description={content.hero.fields.eyebrow} />

      <section className="pb-12">
        <div className="container-edge grid grid-cols-1 gap-12 lg:grid-cols-[1fr_20rem]">
          <div className="flex max-w-3xl flex-col gap-6">
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={Math.min(i * 0.04, 0.2)}>
                <p className="text-pretty text-lg leading-relaxed text-foreground/85">{p}</p>
              </Reveal>
            ))}
            {quote ? (
              <Reveal>
                <blockquote className="mt-4 border-l-2 border-gold-bright/60 pl-6 text-xl font-medium leading-relaxed text-foreground/90">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              </Reveal>
            ) : null}
            <Reveal>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/projects">
                    Explore my projects
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/contact">Contact me</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          {photoUrl ? (
            <Reveal delay={0.1}>
              <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-3xl border border-gold/30 glow-gold">
                <SmartImage
                  src={photoUrl}
                  alt={`Portrait of ${site.name}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 320px, 80vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      <Interests items={content.interests.items} />
      <Journey
        items={content.journey.items.map((i) => ({
          phase: i.phase,
          period: i.period,
          title: i.title,
          description: i.description,
        }))}
      />
      <Expertise skills={content.skills.items.map((s) => ({ name: s.name, category: s.category }))} />
    </>
  );
}
