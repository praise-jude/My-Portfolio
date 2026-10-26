import "server-only";
import { cache } from "react";
import { createServiceClient } from "@/lib/supabase/service";
import { fallbackProjects } from "./defaults";
import type { Project } from "./types";

const COLUMNS =
  "id, slug, name, tagline, description, category, status, logo_url, cover_url, screenshots, tech_stack, website_url, download_url, featured, display_order, seo_title, seo_description, published, deleted_at, created_at, updated_at";

/**
 * Published, non-archived projects for the public site, in display order.
 * Falls back to the built-in list when the database can't be read.
 */
export const getPublicProjects = cache(async (): Promise<Project[]> => {
  const supabase = createServiceClient();
  if (!supabase) return fallbackProjects;
  try {
    const { data, error } = await supabase
      .from("projects")
      .select(COLUMNS)
      .eq("published", true)
      .is("deleted_at", null)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) return fallbackProjects;
    return data as Project[];
  } catch {
    return fallbackProjects;
  }
});

export async function getPublicProject(slug: string): Promise<Project | null> {
  const projects = await getPublicProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

export type AdminProjectQuery = {
  q?: string;
  view?: "active" | "archived";
  sort?: "order" | "name" | "updated";
  page?: number;
  pageSize?: number;
};

export async function getAdminProjects({
  q,
  view = "active",
  sort = "order",
  page = 1,
  pageSize = 20,
}: AdminProjectQuery) {
  const supabase = createServiceClient();
  if (!supabase) return { ok: false as const, error: "SUPABASE_SECRET_KEY is not configured." };

  let query = supabase.from("projects").select(COLUMNS, { count: "exact" });
  query = view === "archived" ? query.not("deleted_at", "is", null) : query.is("deleted_at", null);
  if (q) {
    // Escape PostgREST filter syntax characters before building the OR filter.
    const term = q.replace(/[%,()*\\]/g, " ").trim().slice(0, 80);
    if (term) query = query.or(`name.ilike.%${term}%,category.ilike.%${term}%,slug.ilike.%${term}%`);
  }
  if (sort === "name") query = query.order("name", { ascending: true });
  else if (sort === "updated") query = query.order("updated_at", { ascending: false });
  else query = query.order("display_order", { ascending: true }).order("created_at", { ascending: true });

  const from = (page - 1) * pageSize;
  const { data, error, count } = await query.range(from, from + pageSize - 1);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, projects: data as Project[], total: count ?? 0 };
}

export async function getAdminProject(id: string) {
  const supabase = createServiceClient();
  if (!supabase || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await supabase.from("projects").select(COLUMNS).eq("id", id).maybeSingle();
  return (data as Project | null) ?? null;
}
