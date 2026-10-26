export const PROJECT_STATUSES = ["live", "in_development", "planned", "archived"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const statusLabel: Record<ProjectStatus, string> = {
  live: "Live",
  in_development: "In Development",
  planned: "Planned",
  archived: "Archived",
};

export type Project = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  category: string | null;
  status: ProjectStatus;
  logo_url: string | null;
  cover_url: string | null;
  screenshots: string[];
  tech_stack: string[];
  website_url: string | null;
  download_url: string | null;
  featured: boolean;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Slugs with a hand-built product showcase (mockup + feature grid) on the homepage. */
export const FLAGSHIP_SLUGS = ["inventra", "fraudshield-ai", "forex-ai"] as const;
