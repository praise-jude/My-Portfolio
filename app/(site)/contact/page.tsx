import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";
import { getContent } from "@/lib/content/queries";
import { site } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} about projects, partnerships, and collaborations.`,
  alternates: { canonical: "/contact" },
  openGraph: { url: `${site.url}/contact`, title: `Contact — ${site.name}` },
};

export default async function ContactPage() {
  const content = await getContent();
  return (
    <div className="pt-16">
      <Contact content={content} headingLevel="h1" />
    </div>
  );
}
