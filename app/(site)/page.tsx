import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Products } from "@/components/sections/products";
import { Journey } from "@/components/sections/journey";
import { Interests } from "@/components/sections/interests";
import { Expertise } from "@/components/sections/expertise";
import { Philosophy } from "@/components/sections/philosophy";
import { WorkWithMe } from "@/components/sections/work-with-me";
import { Contact } from "@/components/sections/contact";
import { getContent } from "@/lib/content/queries";
import { getPublicProjects } from "@/lib/projects/queries";

// Content is edited in /admin; pages are regenerated on save and at most
// every 5 minutes otherwise.
export const revalidate = 300;

export default async function Home() {
  const [content, projects] = await Promise.all([getContent(), getPublicProjects()]);

  return (
    <>
      <Hero
        eyebrow={content.hero.fields.eyebrow}
        headline={content.hero.fields.headline}
        intro={content.hero.fields.intro}
      />
      <About
        summary={content.about.fields.summary}
        quote={content.about.fields.quote}
        photoUrl={content.about.fields.photoUrl}
      />
      <Products projects={projects} />
      <Journey
        items={content.journey.items.map((i) => ({
          phase: i.phase,
          period: i.period,
          title: i.title,
          description: i.description,
        }))}
      />
      <Interests items={content.interests.items} />
      <Expertise skills={content.skills.items.map((s) => ({ name: s.name, category: s.category }))} />
      <Philosophy />
      <WorkWithMe
        intro={content.services.fields.intro}
        items={content.services.items}
        availability={content.contact.fields.availability}
      />
      <Contact content={content} />
    </>
  );
}
