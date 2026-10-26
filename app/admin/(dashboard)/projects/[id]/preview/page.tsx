import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminProject } from "@/lib/projects/queries";
import { ProjectDetail } from "@/components/projects/project-detail";
import { Notice } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Preview project" };

type Props = { params: Promise<{ id: string }> };

export default async function PreviewProjectPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const project = await getAdminProject(id);
  if (!project) notFound();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={`/admin/projects/${project.id}`} className="focus-ring text-sm text-muted hover:text-foreground">
          ← Back to editing
        </Link>
        {project.published && !project.deleted_at ? (
          <Link href={`/projects/${project.slug}`} target="_blank" className="focus-ring text-sm text-gold-bright hover:underline">
            Open live page ↗
          </Link>
        ) : null}
      </div>
      <Notice tone="info">
        Preview of the public project page{project.published ? "" : " — this project is a draft and is not publicly visible"}.
      </Notice>
      <div className="overflow-hidden rounded-2xl border border-border-subtle">
        <ProjectDetail project={project} />
      </div>
    </>
  );
}
