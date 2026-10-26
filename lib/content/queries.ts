import "server-only";
import { cache } from "react";
import { createServiceClient } from "@/lib/supabase/service";
import { defaultContent } from "./defaults";
import { isSectionKey, sectionSpecs, validateSection, type SectionKey, type SectionValue } from "./schema";

export type SiteContent = Record<SectionKey, SectionValue>;

export type ContentLoad = {
  content: SiteContent;
  /** Sections that come from the database rather than the built-in defaults. */
  stored: Set<SectionKey>;
  ok: boolean;
};

/**
 * Loads all editable content in one query and overlays it on the defaults.
 * A stored section that no longer passes validation falls back to its
 * default rather than breaking the page.
 */
export const loadContent = cache(async (): Promise<ContentLoad> => {
  const content: SiteContent = { ...defaultContent };
  const stored = new Set<SectionKey>();
  const supabase = createServiceClient();
  if (!supabase) return { content, stored, ok: false };

  try {
    const { data, error } = await supabase.from("site_content").select("key, value");
    if (error) return { content, stored, ok: false };

    for (const row of data) {
      if (!isSectionKey(row.key)) continue;
      const result = validateSection(sectionSpecs[row.key], row.value);
      if (result.ok) {
        content[row.key] = result.value;
        stored.add(row.key);
      }
    }
    return { content, stored, ok: true };
  } catch {
    return { content, stored, ok: false };
  }
});

export async function getContent(): Promise<SiteContent> {
  return (await loadContent()).content;
}

