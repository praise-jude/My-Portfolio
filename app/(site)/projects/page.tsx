import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectCard } from "@/components/projects/project-card";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { getPublicProjects } from "@/lib/projects/queries";
import { site } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Digital products by Jude Omini Ewah across business management, AI, financial technology, digital services, and cloud infrastructure.",
  alternates: { canonical: "/projects" },
  openGraph: { url: `${site.url}/projects`, title: `Projects — ${site.name}` },
};

const groups = [
  { title: "Live & in development", statuses: ["live", "in_development"] },
  { title: "Planned & concepts", statuses: ["planned"] },
  { title: "Archived", statuses: ["archived"] },
] as const;

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Projects & products"
        description="Products I have built or am building. Each is labelled with its real status — planned projects and concepts are marked as such."
      />

      <div className="container-edge flex flex-col gap-20 pb-28">
        {projects.length === 0 ? (
          <p className="text-muted">No projects are published yet — check back soon.</p>
        ) : null}

        {groups.map((group) => {
          const items = projects.filter((p) => (group.statuses as readonly string[]).includes(p.status));
          if (!items.length) return null;
          return (
            <section key={group.title} aria-labelledby={`group-${group.statuses[0]}`}>
              <h2
                id={`group-${group.statuses[0]}`}
                className="mb-6 text-xs font-medium uppercase tracking-[0.22em] text-muted"
              >
                {group.title} <span className="text-muted-dim">· {items.length}</span>
              </h2>
              <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
                {items.map((project) => (
                  <StaggerItem key={project.id} className="h-full">
                    <ProjectCard project={project} />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </section>
          );
        })}
      </div>
    </>
  );
}
