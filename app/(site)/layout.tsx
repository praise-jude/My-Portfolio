import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/effects/scroll-progress";
import { Tracker } from "@/components/analytics/tracker";
import { site } from "@/lib/data";
import { getContent } from "@/lib/content/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: site.name,
        jobTitle: site.title,
        url: site.url,
        email: `mailto:${content.contact.fields.email}`,
        description: content.hero.fields.intro,
        image: content.about.fields.photoUrl
          ? new URL(content.about.fields.photoUrl, site.url).toString()
          : undefined,
        sameAs: content.socials.items.map((s) => s.url),
        knowsAbout: content.interests.items.map((i) => i.title),
        founder: { "@id": `${site.url}/#brand` },
      },
      {
        "@type": "Organization",
        "@id": `${site.url}/#brand`,
        name: "Royalman Digital Concepts",
        founder: { "@id": `${site.url}/#person` },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        author: { "@id": `${site.url}/#person` },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output is escaped for "<" so admin-entered text can't close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <a
        href="#main-content"
        className="glass focus-ring fixed left-4 top-4 z-[100] -translate-y-24 rounded-full px-4 py-2 text-sm font-medium text-foreground transition-transform duration-200 focus:translate-y-0"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer content={content} />
      <Tracker />
    </>
  );
}
