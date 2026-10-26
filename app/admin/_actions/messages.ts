"use server";

import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { formString } from "@/lib/validation";
import { ActionError, UUID_RE, adminMutation } from "./guard";

const ACTIONS = {
  read: { patch: () => ({ read_at: new Date().toISOString() }), audit: "message_read" },
  unread: { patch: () => ({ read_at: null }), audit: "message_unread" },
  archive: { patch: () => ({ archived_at: new Date().toISOString() }), audit: "message_archive" },
  restore: { patch: () => ({ archived_at: null }), audit: "message_restore" },
} as const;

export async function updateMessageAction(form: FormData) {
  const { admin, db } = await adminMutation();
  const id = formString(form, "id");
  const op = formString(form, "op") as keyof typeof ACTIONS;
  if (!UUID_RE.test(id) || !(op in ACTIONS)) throw new ActionError("Invalid request.");

  const { error } = await db.from("contact_submissions").update(ACTIONS[op].patch()).eq("id", id);
  if (error) throw new ActionError(error.message);

  // Read/unread toggles are routine; only archive changes are worth an audit entry.
  if (op === "archive" || op === "restore") {
    await logAudit({ actor: admin.email, action: ACTIONS[op].audit, targetType: "message", targetId: id });
  }
  revalidatePath("/admin", "layout");
}
