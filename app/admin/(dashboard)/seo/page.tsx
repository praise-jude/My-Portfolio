import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { loadContent } from "@/lib/content/queries";
import { Card, PageTitle } from "@/components/admin/ui";
import { SectionCard } from "@/components/admin/section-card";
import { site } from "@/lib/data";

export const metadata: Metadata = { title: "SEO Settings" };

export default async function SeoPage() {
  await requireAdmin();
  const load = await loadContent();
  const seo = load.content.seo.fields;

  return (
    <>
      <PageTitle title="SEO Settings" description="How your site appears in search results and link previews." />
      <SectionCard section="seo" load={load} />

      <Card title="Search result preview" description="Approximate — search engines may rewrite titles and descriptions.">
        <div className="rounded-xl bg-white p-4 text-left">
          <p className="text-xs text-[#202124]">{site.url.replace("https://", "")}</p>
          <p className="mt-1 truncate text-lg text-[#1a0dab]">{seo.title}</p>
          <p className="mt-1 line-clamp-2 text-sm text-[#4d5156]">{seo.description}</p>
        </div>
      </Card>

      <Card title="Also managed automatically">
        <ul className="flex list-disc flex-col gap-1.5 pl-4 text-sm text-muted">
          <li>
            Per-project SEO title and description — set on each project in <Link className="text-gold-bright underline" href="/admin/projects">Projects</Link>.
          </li>
          <li>
            <a className="text-gold-bright underline" href="/sitemap.xml" target="_blank">sitemap.xml</a> lists every published project;{" "}
            <a className="text-gold-bright underline" href="/robots.txt" target="_blank">robots.txt</a> blocks /admin and /api.
          </li>
          <li>Canonical URLs, Open Graph tags and Person / Organization structured data on every public page.</li>
          <li>All admin pages send noindex headers and are excluded from search engines.</li>
        </ul>
      </Card>
    </>
  );
}
