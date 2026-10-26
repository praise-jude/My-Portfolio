import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { ProductSection } from "@/components/sections/products/product-section";
import { InventraMockup } from "@/components/sections/products/inventra-mockup";
import { FraudShieldMockup } from "@/components/sections/products/fraudshield-mockup";
import { ForexAIMockup } from "@/components/sections/products/forex-ai-mockup";
import { ProjectCard } from "@/components/projects/project-card";
import { inventra, fraudShield, forexAI } from "@/lib/data";
import { FLAGSHIP_SLUGS, type Project } from "@/lib/projects/types";

const showcases = [
  { product: inventra, mockup: <InventraMockup /> },
  { product: fraudShield, mockup: <FraudShieldMockup /> },
  { product: forexAI, mockup: <ForexAIMockup /> },
];

export function Products({ projects }: { projects: Project[] }) {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  // A flagship disappears from the homepage when it is unpublished or archived in the admin.
  const flagships = showcases.filter(({ product }) => bySlug.has(product.key));
  const more = projects.filter(
    (p) => p.featured && !(FLAGSHIP_SLUGS as readonly string[]).includes(p.slug)
  );
  const others = projects.filter(
    (p) => !p.featured && !(FLAGSHIP_SLUGS as readonly string[]).includes(p.slug)
  );
  const grid = [...more, ...others].slice(0, 6);

  return (
    <section id="work" className="relative py-28 sm:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Products built end to end"
          description="Platforms I have designed and built — from the database schema to the pixel a user touches."
        />

        {flagships.length ? (
          <div className="mt-20 flex flex-col divide-y divide-border-subtle">
            {flagships.map(({ product, mockup }, i) => (
              <ProductSection
                key={product.key}
                product={product}
                mockup={mockup}
                managed={bySlug.get(product.key)}
                reverse={i % 2 === 1}
              />
            ))}
          </div>
        ) : null}

        {grid.length ? (
          <div className="mt-24">
            <Reveal>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                More of what I&apos;m building
              </h3>
            </Reveal>
            <StaggerGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
              {grid.map((project) => (
                <StaggerItem key={project.id} className="h-full">
                  <ProjectCard project={project} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        ) : null}

        <Reveal className="mt-12">
          <Link
            href="/projects"
            className="focus-ring group inline-flex items-center gap-1.5 text-sm font-medium text-gold-bright"
          >
            View all projects
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
