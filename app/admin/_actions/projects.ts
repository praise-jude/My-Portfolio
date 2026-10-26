"use server";

import { redirect } from "next/navigation";
import { logAudit } from "@/lib/audit";
import { validateProjectForm } from "@/lib/projects/validate";
import { formString } from "@/lib/validation";
import { ActionError, UUID_RE, adminMutation, revalidateSite } from "./guard";

export type ProjectFormState = { errors?: Record<string, string>; message?: string };

export async function saveProjectAction(_prev: ProjectFormState, form: FormData): Promise<ProjectFormState> {
  let ctx;
  try {
    ctx = await adminMutation();
  } catch (e) {
    if (e instanceof ActionError) return { message: e.message };
    throw e;
  }
  const { admin, db } = ctx;

  const id = formString(form, "id");
  if (id && !UUID_RE.test(id)) return { message: "Invalid project." };

  const parsed = validateProjectForm(form);
  if (!parsed.ok) return { errors: parsed.errors, message: "Please fix the highlighted fields." };

  const result = id
    ? await db.from("projects").update(parsed.value).eq("id", id).select("id").single()
    : await db.from("projects").insert(parsed.value).select("id").single();

  if (result.error) {
    if (result.error.code === "23505") {
      return { errors: { slug: "Another project already uses this URL slug." }, message: "Please fix the highlighted fields." };
    }
    console.error("[admin] project save failed", result.error);
    return { message: `Could not save: ${result.error.message}` };
  }

  await logAudit({
    actor: admin.email,
    action: id ? "project_update" : "project_create",
    targetType: "project",
    targetId: result.data.id,
    details: { name: parsed.value.name, slug: parsed.value.slug },
  });
  revalidateSite();
  redirect(`/admin/projects/${result.data.id}?saved=1`);
}

async function simpleUpdate(
  form: FormData,
  patch: Record<string, unknown>,
  action: string,
  filter?: "archived" | "active"
) {
  const { admin, db } = await adminMutation();
  const id = formString(form, "id");
  if (!UUID_RE.test(id)) throw new ActionError("Invalid project.");

  let query = db.from("projects").update(patch).eq("id", id);
  if (filter === "archived") query = query.not("deleted_at", "is", null);
  const { data, error } = await query.select("id, name").maybeSingle();
  if (error) throw new ActionError(error.message);
  if (data) {
    await logAudit({ actor: admin.email, action, targetType: "project", targetId: id, details: { name: data.name } });
  }
  revalidateSite();
}

export async function togglePublishAction(form: FormData) {
  const publish = formString(form, "publish") === "1";
  await simpleUpdate(form, { published: publish }, publish ? "project_publish" : "project_unpublish");
  // Only same-site admin paths are accepted, so the field can't become an open redirect.
  const returnTo = formString(form, "returnTo");
  redirect(/^\/admin\/projects(\/[0-9a-f-]{36})?$/.test(returnTo) ? returnTo : "/admin/projects");
}

export async function archiveProjectAction(form: FormData) {
  await simpleUpdate(form, { deleted_at: new Date().toISOString(), published: false }, "project_archive");
  redirect("/admin/projects?archived=1");
}

export async function restoreProjectAction(form: FormData) {
  await simpleUpdate(form, { deleted_at: null }, "project_restore", "archived");
  redirect("/admin/projects?view=archived&restored=1");
}

/** Permanent delete is only allowed for projects that were archived first. */
export async function deleteProjectAction(form: FormData) {
  const { admin, db } = await adminMutation();
  const id = formString(form, "id");
  if (!UUID_RE.test(id)) throw new ActionError("Invalid project.");

  const { data, error } = await db
    .from("projects")
    .delete()
    .eq("id", id)
    .not("deleted_at", "is", null)
    .select("id, name, slug")
    .maybeSingle();
  if (error) throw new ActionError(error.message);
  if (data) {
    await logAudit({
      actor: admin.email,
      action: "project_delete",
      targetType: "project",
      targetId: id,
      details: { name: data.name, slug: data.slug },
    });
  }
  revalidateSite();
  redirect("/admin/projects?view=archived&deleted=1");
}
