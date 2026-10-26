import "server-only";
import { createServiceClient } from "@/lib/supabase/service";

type AuditEntry = {
  actor: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
};

/** Best-effort: an audit write failure is logged but never blocks the action. */
export async function logAudit({ actor, action, targetType, targetId, details }: AuditEntry) {
  const supabase = createServiceClient();
  if (!supabase) return;

  const { error } = await supabase.from("audit_log").insert({
    actor: actor.slice(0, 320),
    action,
    target_type: targetType ?? null,
    target_id: targetId ?? null,
    details: details ?? {},
  });

  if (error) console.error("[audit] failed to record", action, error.message);
}
