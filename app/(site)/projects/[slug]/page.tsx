import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/project-detail";
import { getPublicProject, getPublicProjects } from "@/lib/projects/queries";
import { statusLabel } from "@/lib/projects/types";
import { site } from "@/lib/data";

export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getPublicProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProject(slug);
  if (!project) return { title: "Project not found" };

  const title = project.seo_title || `${project.name}${project.tagline ? ` — ${project.tagline}` : ""}`;
  const description = project.seo_description || project.description.slice(0, 300);
  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      url: `${site.url}/projects/${project.slug}`,
      title,
      description,
      images: project.cover_url ? [{ url: project.cover_url }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getPublicProject(slug);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    headline: project.tagline ?? project.name,
    description: project.description,
    url: `${site.url}/projects/${project.slug}`,
    genre: project.category ?? undefined,
    creativeWorkStatus: statusLabel[project.status],
    image: project.cover_url ? new URL(project.cover_url, site.url).toString() : undefined,
    sameAs: project.website_url ?? undefined,
    author: { "@id": `${site.url}/#person` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ProjectDetail project={project} />
    </>
  );
}
