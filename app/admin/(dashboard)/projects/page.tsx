import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminProjects } from "@/lib/projects/queries";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/projects/status-badge";
import { Card, EmptyState, Notice, PageTitle, Pagination, formatDateTime, pageParam, stringParam } from "@/components/admin/ui";
import { inputClass } from "@/components/admin/form-styles";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { cn } from "@/lib/utils";
import { deleteProjectAction, restoreProjectAction, togglePublishAction } from "../../_actions/projects";

export const metadata: Metadata = { title: "Projects" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const PAGE_SIZE = 20;

export default async function ProjectsAdminPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const q = stringParam(params.q);
  const view = stringParam(params.view) === "archived" ? "archived" : "active";
  const sortParam = stringParam(params.sort);
  const sort = sortParam === "name" || sortParam === "updated" ? sortParam : "order";
  const page = pageParam(params.page);

  const result = await getAdminProjects({ q, view, sort, page, pageSize: PAGE_SIZE });
  const qs = (overrides: Record<string, string | number>) => {
    const s = new URLSearchParams({ ...(q && { q }), view, sort, page: String(page) });
    for (const [k, v] of Object.entries(overrides)) s.set(k, String(v));
    return `/admin/projects?${s.toString()}`;
  };

  return (
    <>
      <PageTitle
        title="Projects"
        description="Your portfolio. Unpublished projects are hidden from the public site; archived ones can be restored."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/projects/new">
              <Plus size={15} /> New project
            </Link>
          </Button>
        }
      />

      {params.archived ? <Notice tone="success">Project archived. It can be restored from the Archived tab.</Notice> : null}
      {params.restored ? <Notice tone="success">Project restored. It is unpublished until you publish it again.</Notice> : null}
      {params.deleted ? <Notice tone="success">Project permanently deleted.</Notice> : null}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-1 rounded-xl border border-border-subtle bg-surface/60 p-1">
          {(["active", "archived"] as const).map((v) => (
            <Link
              key={v}
              href={`/admin/projects?view=${v}`}
              aria-current={view === v ? "true" : undefined}
              className={cn(
                "focus-ring rounded-lg px-3 py-1.5 text-sm capitalize",
                view === v ? "bg-gold/15 text-gold-bright" : "text-muted hover:text-foreground"
              )}
            >
              {v}
            </Link>
          ))}
        </div>
        <form method="get" className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="view" value={view} />
          <label htmlFor="q" className="sr-only">
            Search projects
          </label>
          <input id="q" name="q" defaultValue={q} placeholder="Search name, category, slug" className={cn(inputClass, "w-56 py-1.5")} />
          <label htmlFor="sort" className="sr-only">
            Sort
          </label>
          <select id="sort" name="sort" defaultValue={sort} className={cn(inputClass, "w-auto py-1.5")}>
            <option value="order">Display order</option>
            <option value="name">Name</option>
            <option value="updated">Recently updated</option>
          </select>
          <button type="submit" className="focus-ring rounded-lg border border-border-subtle px-3 py-1.5 text-sm text-muted hover:text-foreground">
            Apply
          </button>
        </form>
      </div>

      <Card>
        {!result.ok ? (
          <Notice tone="error">
            Projects could not be loaded: {result.error}. If the table is missing, apply the database migration (see Settings).
          </Notice>
        ) : result.projects.length === 0 ? (
          <EmptyState title={q ? "No projects match your search" : view === "archived" ? "No archived projects" : "No projects yet"}>
            {view === "active" && !q ? <Link className="text-gold-bright underline" href="/admin/projects/new">Create your first project</Link> : null}
          </EmptyState>
        ) : (
          <>
            <div className="-mx-5 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-xs text-muted-dim">
                  <tr className="border-b border-border-subtle">
                    <th scope="col" className="px-5 py-2 font-medium">Project</th>
                    <th scope="col" className="px-3 py-2 font-medium">Status</th>
                    <th scope="col" className="px-3 py-2 font-medium">Visibility</th>
                    <th scope="col" className="px-3 py-2 font-medium">Order</th>
                    <th scope="col" className="px-3 py-2 font-medium">Updated</th>
                    <th scope="col" className="px-5 py-2 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {result.projects.map((p) => (
                    <tr key={p.id}>
                      <td className="px-5 py-3">
                        <Link href={`/admin/projects/${p.id}`} className="focus-ring font-medium text-foreground hover:text-gold-bright">
                          {p.name}
                        </Link>
                        <p className="text-xs text-muted-dim">
                          /{p.slug}
                          {p.featured ? <span className="ml-2 text-gold-bright">★ Featured</span> : null}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-3 py-3 text-muted">{view === "archived" ? "Archived" : p.published ? "Published" : "Draft"}</td>
                      <td className="px-3 py-3 tabular-nums text-muted">{p.display_order}</td>
                      <td className="px-3 py-3 text-xs text-muted-dim">{formatDateTime(p.updated_at)}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          {view === "active" ? (
                            <>
                              <form action={togglePublishAction}>
                                <input type="hidden" name="id" value={p.id} />
                                <input type="hidden" name="publish" value={p.published ? "0" : "1"} />
                                <button type="submit" className="focus-ring rounded-lg border border-border-subtle px-2.5 py-1 text-xs text-muted hover:text-foreground">
                                  {p.published ? "Unpublish" : "Publish"}
                                </button>
                              </form>
                              <Link href={`/admin/projects/${p.id}`} className="focus-ring rounded-lg border border-border-subtle px-2.5 py-1 text-xs text-muted hover:text-foreground">
                                Edit
                              </Link>
                            </>
                          ) : (
                            <>
                              <form action={restoreProjectAction}>
                                <input type="hidden" name="id" value={p.id} />
                                <button type="submit" className="focus-ring rounded-lg border border-border-subtle px-2.5 py-1 text-xs text-muted hover:text-foreground">
                                  Restore
                                </button>
                              </form>
                              <form action={deleteProjectAction}>
                                <input type="hidden" name="id" value={p.id} />
                                <ConfirmSubmit
                                  title={`Delete ${p.name} permanently?`}
                                  message="This removes the project and cannot be undone."
                                  confirmLabel="Delete permanently"
                                  className="focus-ring rounded-lg border border-red-500/30 px-2.5 py-1 text-xs text-red-300 hover:bg-red-500/10"
                                >
                                  Delete
                                </ConfirmSubmit>
                              </form>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pageSize={PAGE_SIZE} total={result.total} hrefFor={(n) => qs({ page: n })} />
          </>
        )}
      </Card>
    </>
  );
}
