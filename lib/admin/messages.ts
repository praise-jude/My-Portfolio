import "server-only";
import { createServiceClient } from "@/lib/supabase/service";

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
  read_at: string | null;
  archived_at: string | null;
};

/**
 * Selects with the post-migration columns, falling back to the original
 * schema so messages remain readable even before the migration is applied.
 */
async function selectMessages(build: (cols: string) => PromiseLike<{ data: unknown; error: { message: string } | null; count?: number | null }>) {
  const full = await build("id, name, email, subject, message, created_at, read_at, archived_at");
  if (!full.error) return { ...full, legacy: false };
  const legacy = await build("id, name, email, message, created_at");
  return { ...legacy, legacy: true };
}

export async function getMessages({
  q,
  view = "inbox",
  page = 1,
  pageSize = 20,
}: {
  q?: string;
  view?: "inbox" | "archived";
  page?: number;
  pageSize?: number;
}) {
  const supabase = createServiceClient();
  if (!supabase) return { ok: false as const, error: "SUPABASE_SECRET_KEY is not configured." };

  const from = (page - 1) * pageSize;
  const term = q?.replace(/[%,()*\\]/g, " ").trim().slice(0, 80);

  const result = await selectMessages((cols) => {
    let query = supabase.from("contact_submissions").select(cols, { count: "exact" });
    if (cols.includes("archived_at")) {
      query = view === "archived" ? query.not("archived_at", "is", null) : query.is("archived_at", null);
    }
    if (term) {
      const subject = cols.includes("subject") ? `,subject.ilike.%${term}%` : "";
      query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%,message.ilike.%${term}%${subject}`);
    }
    return query.order("created_at", { ascending: false }).range(from, from + pageSize - 1);
  });

  if (result.error) return { ok: false as const, error: result.error.message };
  const messages = (result.data as Partial<Message>[]).map((m) => ({
    subject: null,
    read_at: null,
    archived_at: null,
    ...m,
  })) as Message[];
  return { ok: true as const, messages, total: result.count ?? 0, legacy: result.legacy };
}

export async function getUnreadCount(): Promise<number> {
  const supabase = createServiceClient();
  if (!supabase) return 0;
  const { count, error } = await supabase
    .from("contact_submissions")
    .select("id", { count: "exact", head: true })
    .is("read_at", null)
    .is("archived_at", null);
  return error ? 0 : (count ?? 0);
}

export async function getMessageTotals() {
  const supabase = createServiceClient();
  if (!supabase) return null;
  const { count, error } = await supabase
    .from("contact_submissions")
    .select("id", { count: "exact", head: true });
  return error ? null : (count ?? 0);
}
