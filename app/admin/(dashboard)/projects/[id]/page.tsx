import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminProject } from "@/lib/projects/queries";
import { Notice, PageTitle } from "@/components/admin/ui";
import { ProjectForm } from "@/components/admin/project-form";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { archiveProjectAction, togglePublishAction } from "../../../_actions/projects";

export const metadata: Metadata = { title: "Edit project" };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EditProjectPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const project = await getAdminProject(id);
  if (!project) notFound();

  const archived = Boolean(project.deleted_at);
  const btn = "focus-ring inline-flex items-center gap-1.5 rounded-full border border-border-subtle px-4 py-2 text-sm text-muted hover:text-foreground";

  return (
    <>
      <Link href="/admin/projects" className="focus-ring text-sm text-muted hover:text-foreground">
        ← Projects
      </Link>
      <PageTitle
        title={project.name}
        description={archived ? "Archived — restore it from the Archived tab to edit visibility." : project.published ? "Published" : "Draft — not visible on the public site"}
        actions={
          <>
            <Link href={`/admin/projects/${project.id}/preview`} className={btn}>
              <Eye size={14} /> Preview
            </Link>
            {!archived ? (
              <>
                <form action={togglePublishAction}>
                  <input type="hidden" name="id" value={project.id} />
                  <input type="hidden" name="publish" value={project.published ? "0" : "1"} />
                  <input type="hidden" name="returnTo" value={`/admin/projects/${project.id}`} />
                  <button type="submit" className={btn}>
                    {project.published ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <form action={archiveProjectAction}>
                  <input type="hidden" name="id" value={project.id} />
                  <ConfirmSubmit
                    title={`Archive ${project.name}?`}
                    message="It will be removed from the public site immediately. You can restore it later from the Archived tab."
                    confirmLabel="Archive"
                    className="focus-ring rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
                  >
                    Archive
                  </ConfirmSubmit>
                </form>
              </>
            ) : null}
          </>
        }
      />
      {sp.saved ? <Notice tone="success">Saved. Public pages have been refreshed.</Notice> : null}
      <ProjectForm key={project.updated_at} project={project} />
    </>
  );
}
