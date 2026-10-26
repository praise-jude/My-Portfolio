import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { getMessages } from "@/lib/admin/messages";
import { Card, EmptyState, Notice, PageTitle, Pagination, formatDateTime, pageParam, stringParam } from "@/components/admin/ui";
import { inputClass } from "@/components/admin/form-styles";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { cn } from "@/lib/utils";
import { updateMessageAction } from "../../_actions/messages";

export const metadata: Metadata = { title: "Messages" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const PAGE_SIZE = 15;

export default async function MessagesPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const q = stringParam(params.q);
  const view = stringParam(params.view) === "archived" ? "archived" : "inbox";
  const page = pageParam(params.page);
  const result = await getMessages({ q, view, page, pageSize: PAGE_SIZE });

  const btn = "focus-ring rounded-lg border border-border-subtle px-2.5 py-1 text-xs text-muted hover:text-foreground";

  return (
    <>
      <PageTitle title="Messages" description="Contact form submissions from your website." />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-1 rounded-xl border border-border-subtle bg-surface/60 p-1">
          {(["inbox", "archived"] as const).map((v) => (
            <Link
              key={v}
              href={`/admin/messages?view=${v}`}
              aria-current={view === v ? "true" : undefined}
              className={cn("focus-ring rounded-lg px-3 py-1.5 text-sm capitalize", view === v ? "bg-gold/15 text-gold-bright" : "text-muted hover:text-foreground")}
            >
              {v}
            </Link>
          ))}
        </div>
        <form method="get" className="flex gap-2">
          <input type="hidden" name="view" value={view} />
          <label htmlFor="q" className="sr-only">Search messages</label>
          <input id="q" name="q" defaultValue={q} placeholder="Search name, email, text" className={cn(inputClass, "w-60 py-1.5")} />
          <button type="submit" className="focus-ring rounded-lg border border-border-subtle px-3 py-1.5 text-sm text-muted hover:text-foreground">Search</button>
        </form>
      </div>

      {!result.ok ? (
        <Notice tone="error">Messages could not be loaded: {result.error}</Notice>
      ) : (
        <>
          {result.legacy ? (
            <Notice tone="warning">
              Read/archive tracking needs the database migration. Messages are shown read-only until it is applied.
            </Notice>
          ) : null}
          {result.messages.length === 0 ? (
            <EmptyState title={q ? "No messages match your search" : view === "archived" ? "No archived messages" : "Inbox is empty"} />
          ) : (
            <div className="flex flex-col gap-3">
              {result.messages.map((m) => (
                <Card key={m.id} className={cn(!m.read_at && !result.legacy && "border-gold/30")}>
                  <article className="flex flex-col gap-3">
                    <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          {!m.read_at && !result.legacy ? <span className="size-1.5 shrink-0 rounded-full bg-gold-bright" aria-label="Unread" /> : null}
                          <span className="truncate">{m.subject || "(no subject)"}</span>
                        </h2>
                        <p className="truncate text-xs text-muted">
                          {m.name} · <a className="hover:text-foreground" href={`mailto:${m.email}`}>{m.email}</a>
                        </p>
                      </div>
                      <time className="shrink-0 text-xs text-muted-dim" dateTime={m.created_at}>{formatDateTime(m.created_at)}</time>
                    </header>
                    <p className="whitespace-pre-line break-words text-sm leading-relaxed text-foreground/85">{m.message}</p>
                    <footer className="flex flex-wrap gap-2">
                      <a
                        className={cn(btn, "inline-flex items-center gap-1.5")}
                        href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "Your message"}`)}`}
                      >
                        <Mail size={12} /> Reply
                      </a>
                      {!result.legacy ? (
                        <>
                          <form action={updateMessageAction}>
                            <input type="hidden" name="id" value={m.id} />
                            <input type="hidden" name="op" value={m.read_at ? "unread" : "read"} />
                            <button type="submit" className={btn}>{m.read_at ? "Mark unread" : "Mark read"}</button>
                          </form>
                          <form action={updateMessageAction}>
                            <input type="hidden" name="id" value={m.id} />
                            <input type="hidden" name="op" value={view === "archived" ? "restore" : "archive"} />
                            {view === "archived" ? (
                              <button type="submit" className={btn}>Move to inbox</button>
                            ) : (
                              <ConfirmSubmit
                                title="Archive this message?"
                                message="It moves to the Archived tab. Nothing is deleted."
                                confirmLabel="Archive"
                                tone="default"
                                className={btn}
                              >
                                Archive
                              </ConfirmSubmit>
                            )}
                          </form>
                        </>
                      ) : null}
                    </footer>
                  </article>
                </Card>
              ))}
            </div>
          )}
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={result.total}
            hrefFor={(n) => `/admin/messages?${new URLSearchParams({ view, ...(q && { q }), page: String(n) })}`}
          />
        </>
      )}
    </>
  );
}
