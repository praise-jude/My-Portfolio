import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { PageTitle } from "@/components/admin/ui";
import { ProjectForm } from "@/components/admin/project-form";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/projects" className="focus-ring text-sm text-muted hover:text-foreground">
        ← Projects
      </Link>
      <PageTitle title="New project" />
      <ProjectForm />
    </>
  );
}
