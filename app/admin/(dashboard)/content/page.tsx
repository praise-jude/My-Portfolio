import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { loadContent } from "@/lib/content/queries";
import { sectionSpecs, type SectionKey } from "@/lib/content/schema";
import { Notice, PageTitle } from "@/components/admin/ui";
import { SectionCard } from "@/components/admin/section-card";

export const metadata: Metadata = { title: "Pages & Content" };

const SECTIONS: SectionKey[] = ["hero", "about", "services", "interests", "skills", "journey", "contact", "socials"];

export default async function ContentPage() {
  await requireAdmin();
  const load = await loadContent();

  return (
    <>
      <PageTitle
        title="Pages & Content"
        description="Edit the text on your homepage, About and Contact pages. Saving refreshes the public site."
      />
      {!load.ok ? (
        <Notice tone="warning">
          The content table couldn&apos;t be read, so the built-in defaults are shown and saving will fail until the
          database migration is applied. <Link className="underline" href="/admin/settings">Check system status</Link>.
        </Notice>
      ) : null}
      <nav aria-label="Sections" className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <a key={s} href={`#${s}`} className="focus-ring rounded-full border border-border-subtle px-3 py-1 text-xs text-muted hover:text-foreground">
            {sectionSpecs[s].title}
          </a>
        ))}
      </nav>
      {SECTIONS.map((s) => (
        <SectionCard key={s} section={s} load={load} />
      ))}
    </>
  );
}
