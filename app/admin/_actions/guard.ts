import "server-only";
import { revalidatePath } from "next/cache";
import { requireAdmin, type AdminUser } from "@/lib/auth/admin";
import { rateLimit } from "@/lib/security/rate-limit";
import { createServiceClient } from "@/lib/supabase/service";

export class ActionError extends Error {}

/**
 * Common preamble for every admin mutation: re-verify the admin on the
 * server (never trust that the page was protected), throttle, and get the
 * service client.
 */
export async function adminMutation(): Promise<{ admin: AdminUser; db: NonNullable<ReturnType<typeof createServiceClient>> }> {
  const admin = await requireAdmin();
  if (!(await rateLimit(`admin:${admin.id}`, 60, 60))) {
    throw new ActionError("Too many changes in a short time. Wait a minute and try again.");
  }
  const db = createServiceClient();
  if (!db) throw new ActionError("SUPABASE_SECRET_KEY is not configured on the server.");
  return { admin, db };
}

/** Regenerates every public page so edits show immediately. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
