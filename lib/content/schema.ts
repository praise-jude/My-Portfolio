import { isEmail, isHttpUrl, isImageSrc } from "@/lib/validation";

export type FieldKind = "text" | "textarea" | "url" | "email" | "image";

export type FieldSpec = {
  key: string;
  label: string;
  kind: FieldKind;
  max: number;
  required?: boolean;
  help?: string;
};

export type ListSpec = {
  label: string;
  itemLabel: string;
  fields: FieldSpec[];
  maxItems: number;
};

export type SectionSpec = {
  key: SectionKey;
  title: string;
  description: string;
  fields: FieldSpec[];
  list?: ListSpec;
};

export const SECTION_KEYS = [
  "hero",
  "about",
  "services",
  "interests",
  "skills",
  "journey",
  "contact",
  "socials",
  "seo",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export type SectionValue = {
  fields: Record<string, string>;
  items: Record<string, string>[];
};

export const sectionSpecs: Record<SectionKey, SectionSpec> = {
  hero: {
    key: "hero",
    title: "Homepage hero",
    description: "The first thing visitors see.",
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text", max: 80 },
      { key: "headline", label: "Headline", kind: "textarea", max: 160, required: true },
      { key: "intro", label: "Introduction", kind: "textarea", max: 500, required: true },
    ],
  },
  about: {
    key: "about",
    title: "About me",
    description: "The summary appears on the homepage; the full story on /about.",
    fields: [
      { key: "summary", label: "Homepage summary", kind: "textarea", max: 600, required: true },
      {
        key: "body",
        label: "Full story (/about)",
        kind: "textarea",
        max: 6000,
        required: true,
        help: "Separate paragraphs with a blank line.",
      },
      {
        key: "photoUrl",
        label: "Profile photo",
        kind: "image",
        max: 500,
        help: "Optional. An https:// image URL, or a file in /public such as /profile.jpg.",
      },
      { key: "quote", label: "Pull quote", kind: "textarea", max: 300 },
    ],
  },
  services: {
    key: "services",
    title: "Work with me",
    description: "Services and ways to collaborate.",
    fields: [{ key: "intro", label: "Introduction", kind: "textarea", max: 400 }],
    list: {
      label: "Services",
      itemLabel: "Service",
      maxItems: 12,
      fields: [
        { key: "title", label: "Title", kind: "text", max: 80, required: true },
        { key: "description", label: "Description", kind: "textarea", max: 300, required: true },
      ],
    },
  },
  interests: {
    key: "interests",
    title: "Technology & business interests",
    description: "The areas you build in.",
    fields: [],
    list: {
      label: "Interests",
      itemLabel: "Interest",
      maxItems: 12,
      fields: [
        { key: "title", label: "Title", kind: "text", max: 80, required: true },
        { key: "description", label: "Description", kind: "textarea", max: 300 },
      ],
    },
  },
  skills: {
    key: "skills",
    title: "Skills & areas of focus",
    description: "Only list skills you actually use.",
    fields: [],
    list: {
      label: "Skills",
      itemLabel: "Skill",
      maxItems: 40,
      fields: [
        { key: "name", label: "Skill", kind: "text", max: 60, required: true },
        { key: "category", label: "Category", kind: "text", max: 40, required: true },
      ],
    },
  },
  journey: {
    key: "journey",
    title: "Entrepreneurial journey",
    description: "Milestones, in order.",
    fields: [],
    list: {
      label: "Milestones",
      itemLabel: "Milestone",
      maxItems: 20,
      fields: [
        { key: "phase", label: "Phase", kind: "text", max: 60, required: true },
        { key: "period", label: "Period", kind: "text", max: 40 },
        { key: "title", label: "Title", kind: "text", max: 100, required: true },
        { key: "description", label: "Description", kind: "textarea", max: 500, required: true },
      ],
    },
  },
  contact: {
    key: "contact",
    title: "Contact details",
    description: "Shown in the contact section and footer.",
    fields: [
      { key: "email", label: "Public email", kind: "email", max: 254, required: true },
      { key: "location", label: "Location", kind: "text", max: 80 },
      { key: "availability", label: "Availability note", kind: "textarea", max: 300 },
    ],
  },
  socials: {
    key: "socials",
    title: "Social links",
    description: "Networks named GitHub, LinkedIn or X get their own icon; any other link shows a globe.",
    fields: [],
    list: {
      label: "Links",
      itemLabel: "Link",
      maxItems: 10,
      fields: [
        { key: "label", label: "Network", kind: "text", max: 40, required: true },
        { key: "url", label: "URL", kind: "url", max: 500, required: true },
      ],
    },
  },
  seo: {
    key: "seo",
    title: "SEO settings",
    description: "Default title, description and keywords for search engines and link previews.",
    fields: [
      { key: "title", label: "Site title", kind: "text", max: 70, required: true },
      { key: "description", label: "Meta description", kind: "textarea", max: 300, required: true },
      { key: "keywords", label: "Keywords", kind: "textarea", max: 600, help: "Comma separated." },
    ],
  },
};

export function isSectionKey(value: string): value is SectionKey {
  return (SECTION_KEYS as readonly string[]).includes(value);
}

function checkField(spec: FieldSpec, raw: unknown): { value: string; error?: string } {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) {
    return spec.required ? { value, error: `${spec.label} is required.` } : { value };
  }
  if (value.length > spec.max) {
    return { value, error: `${spec.label} must be ${spec.max} characters or fewer.` };
  }
  if (spec.kind === "url" && !isHttpUrl(value)) {
    return { value, error: `${spec.label} must be a full http(s):// URL.` };
  }
  if (spec.kind === "image" && !isImageSrc(value)) {
    return { value, error: `${spec.label} must be an http(s):// URL or a /path in the site.` };
  }
  if (spec.kind === "email" && !isEmail(value)) {
    return { value, error: `${spec.label} must be a valid email address.` };
  }
  return { value };
}

export type ValidationResult =
  | { ok: true; value: SectionValue }
  | { ok: false; errors: string[] };

/** Validates untrusted input (from a form or the database) against a section spec. */
export function validateSection(spec: SectionSpec, input: unknown): ValidationResult {
  const source = (input && typeof input === "object" ? input : {}) as {
    fields?: Record<string, unknown>;
    items?: unknown;
  };
  const errors: string[] = [];
  const fields: Record<string, string> = {};

  for (const f of spec.fields) {
    const r = checkField(f, source.fields?.[f.key]);
    if (r.error) errors.push(r.error);
    fields[f.key] = r.value;
  }

  const items: Record<string, string>[] = [];
  if (spec.list) {
    const rawItems = Array.isArray(source.items) ? source.items : [];
    if (rawItems.length > spec.list.maxItems) {
      errors.push(`At most ${spec.list.maxItems} ${spec.list.label.toLowerCase()} are allowed.`);
    }
    rawItems.slice(0, spec.list.maxItems).forEach((rawItem, i) => {
      const obj = (rawItem && typeof rawItem === "object" ? rawItem : {}) as Record<string, unknown>;
      // Silently drop rows the admin left completely empty.
      if (spec.list!.fields.every((f) => !String(obj[f.key] ?? "").trim())) return;
      const item: Record<string, string> = {};
      for (const f of spec.list!.fields) {
        const r = checkField(f, obj[f.key]);
        if (r.error) errors.push(`${spec.list!.itemLabel} ${i + 1}: ${r.error}`);
        item[f.key] = r.value;
      }
      items.push(item);
    });
  }

  return errors.length ? { ok: false, errors } : { ok: true, value: { fields, items } };
}
