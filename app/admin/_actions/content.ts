"use server";

import { logAudit } from "@/lib/audit";
import { isSectionKey, sectionSpecs, validateSection } from "@/lib/content/schema";
import { formString } from "@/lib/validation";
import { ActionError, adminMutation, revalidateSite } from "./guard";

export type ContentFormState = { ok?: boolean; errors?: string[]; savedAt?: number };

const MAX_ITEMS_JSON = 100_000;

export async function saveContentAction(_prev: ContentFormState, form: FormData): Promise<ContentFormState> {
  const section = formString(form, "section");
  if (!isSectionKey(section)) return { errors: ["Unknown section."] };
  const spec = sectionSpecs[section];

  let ctx;
  try {
    ctx = await adminMutation();
  } catch (e) {
    if (e instanceof ActionError) return { errors: [e.message] };
    throw e;
  }
  const { admin, db } = ctx;

  const fields: Record<string, string> = {};
  for (const f of spec.fields) fields[f.key] = formString(form, `field.${f.key}`);

  let items: unknown = [];
  if (spec.list) {
    const raw = formString(form, "items");
    if (raw.length > MAX_ITEMS_JSON) return { errors: ["Too much content in one save."] };
    try {
      items = raw ? JSON.parse(raw) : [];
    } catch {
      return { errors: ["The list could not be read. Reload the page and try again."] };
    }
  }

  const result = validateSection(spec, { fields, items });
  if (!result.ok) return { errors: result.errors };

  const { error } = await db.from("site_content").upsert({
    key: section,
    value: result.value,
    updated_at: new Date().toISOString(),
    updated_by: admin.email,
  });
  if (error) {
    console.error("[admin] content save failed", error);
    return { errors: [`Could not save: ${error.message}`] };
  }

  await logAudit({ actor: admin.email, action: "content_update", targetType: "content", targetId: section, details: { section: spec.title } });
  revalidateSite();
  return { ok: true, savedAt: Date.now() };
}

/** Deletes the stored override so the section falls back to its built-in default. */
export async function resetContentAction(form: FormData) {
  const section = formString(form, "section");
  if (!isSectionKey(section)) throw new ActionError("Unknown section.");
  const { admin, db } = await adminMutation();
  const { error } = await db.from("site_content").delete().eq("key", section);
  if (error) throw new ActionError(error.message);
  await logAudit({ actor: admin.email, action: "content_reset", targetType: "content", targetId: section, details: { section: sectionSpecs[section].title } });
  revalidateSite();
}
