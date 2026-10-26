import { formString, isHttpUrl, isImageSrc, isSlug, parseList, slugify } from "@/lib/validation";
import { PROJECT_STATUSES, type ProjectStatus } from "./types";

export type ProjectInput = {
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
};

export type ProjectValidation =
  | { ok: true; value: ProjectInput }
  | { ok: false; errors: Record<string, string> };

function optional(value: string) {
  return value ? value : null;
}

export function validateProjectForm(form: FormData): ProjectValidation {
  const errors: Record<string, string> = {};

  const name = formString(form, "name");
  if (!name) errors.name = "Name is required.";
  else if (name.length > 120) errors.name = "Name must be 120 characters or fewer.";

  const slug = formString(form, "slug") || slugify(name);
  if (!isSlug(slug)) errors.slug = "Use lowercase letters, numbers and single hyphens.";

  const tagline = formString(form, "tagline");
  if (tagline.length > 160) errors.tagline = "Tagline must be 160 characters or fewer.";

  const description = formString(form, "description");
  if (description.length > 5000) errors.description = "Description must be 5000 characters or fewer.";

  const category = formString(form, "category");
  if (category.length > 80) errors.category = "Category must be 80 characters or fewer.";

  const status = formString(form, "status") as ProjectStatus;
  if (!PROJECT_STATUSES.includes(status)) errors.status = "Choose a valid status.";

  const urls = {
    website_url: formString(form, "website_url"),
    download_url: formString(form, "download_url"),
  };
  for (const [key, value] of Object.entries(urls)) {
    if (value && (!isHttpUrl(value) || value.length > 500)) {
      errors[key] = "Must be a full http(s):// URL — leave blank if there isn't a working link.";
    }
  }

  const images = { logo_url: formString(form, "logo_url"), cover_url: formString(form, "cover_url") };
  for (const [key, value] of Object.entries(images)) {
    if (value && (!isImageSrc(value) || value.length > 500)) {
      errors[key] = "Must be an http(s):// URL or a /path to a file in /public.";
    }
  }

  const screenshots = formString(form, "screenshots")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 12);
  if (screenshots.some((s) => !isImageSrc(s) || s.length > 500)) {
    errors.screenshots = "Each screenshot must be an http(s):// URL or a /path, one per line.";
  }

  const orderRaw = formString(form, "display_order");
  const display_order = orderRaw ? Number(orderRaw) : 0;
  if (!Number.isInteger(display_order) || display_order < 0 || display_order > 10000) {
    errors.display_order = "Order must be a whole number between 0 and 10000.";
  }

  const seo_title = formString(form, "seo_title");
  if (seo_title.length > 120) errors.seo_title = "SEO title must be 120 characters or fewer.";
  const seo_description = formString(form, "seo_description");
  if (seo_description.length > 300) errors.seo_description = "SEO description must be 300 characters or fewer.";

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    value: {
      slug,
      name,
      tagline: optional(tagline),
      description,
      category: optional(category),
      status,
      logo_url: optional(images.logo_url),
      cover_url: optional(images.cover_url),
      screenshots,
      tech_stack: parseList(formString(form, "tech_stack"), 30, 40),
      website_url: optional(urls.website_url),
      download_url: optional(urls.download_url),
      featured: form.get("featured") === "on",
      display_order,
      seo_title: optional(seo_title),
      seo_description: optional(seo_description),
      published: form.get("published") === "on",
    },
  };
}
