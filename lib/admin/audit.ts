import "server-only";
import { createServiceClient } from "@/lib/supabase/service";

export type AuditRow = {
  id: number;
  created_at: string;
  actor: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, unknown>;
};

const COLUMNS = "id, created_at, actor, action, target_type, target_id, details";

export async function getRecentAudit(limit: number): Promise<AuditRow[]> {
  const supabase = createServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("audit_log")
    .select(COLUMNS)
    .order("id", { ascending: false })
    .limit(limit);
  return error ? [] : (data as AuditRow[]);
}

export async function getAuditPage({ action, page, pageSize = 30 }: { action?: string; page: number; pageSize?: number }) {
  const supabase = createServiceClient();
  if (!supabase) return { ok: false as const, error: "SUPABASE_SECRET_KEY is not configured." };
  let query = supabase.from("audit_log").select(COLUMNS, { count: "exact" });
  if (action && /^[a-z_]{1,80}$/.test(action)) query = query.eq("action", action);
  const from = (page - 1) * pageSize;
  const { data, error, count } = await query.order("id", { ascending: false }).range(from, from + pageSize - 1);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, rows: data as AuditRow[], total: count ?? 0 };
}
