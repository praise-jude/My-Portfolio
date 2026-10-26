"use client";

import { useActionState, useState } from "react";
import type { Project } from "@/lib/projects/types";
import { PROJECT_STATUSES, statusLabel } from "@/lib/projects/types";
import { slugify } from "@/lib/validation";
import { saveProjectAction, type ProjectFormState } from "@/app/admin/_actions/projects";
import { SubmitButton } from "./submit-button";
import { helpClass, inputClass, labelClass } from "./form-styles";
import { cn } from "@/lib/utils";

type FieldProps = {
  name: string;
  label: string;
  error?: string;
  help?: string;
  children: React.ReactNode;
  className?: string;
};

function Field({ name, label, error, help, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="text-xs text-red-400">
          {error}
        </p>
      ) : help ? (
        <p id={`${name}-help`} className={helpClass}>
          {help}
        </p>
      ) : null}
    </div>
  );
}

export function ProjectForm({ project }: { project?: Project }) {
  const [state, action] = useActionState<ProjectFormState, FormData>(saveProjectAction, {});
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [slug, setSlug] = useState(project?.slug ?? "");
  const e = state.errors ?? {};

  const aria = (name: string) => ({
    "aria-invalid": e[name] ? true : undefined,
    "aria-describedby": e[name] ? `${name}-error` : undefined,
  });

  return (
    <form action={action} className="flex flex-col gap-6" noValidate>
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      {state.message ? (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {state.message}
        </p>
      ) : null}

      <fieldset className="grid grid-cols-1 gap-4 rounded-2xl border border-border-subtle bg-surface/60 p-5 sm:grid-cols-2">
        <legend className="px-1 text-sm font-semibold text-foreground">Basics</legend>
        <Field name="name" label="Name *" error={e.name}>
          <input
            id="name"
            name="name"
            required
            maxLength={120}
            defaultValue={project?.name}
            onChange={(ev) => {
              if (!slugTouched) setSlug(slugify(ev.target.value));
            }}
            className={inputClass}
            {...aria("name")}
          />
        </Field>
        <Field name="slug" label="URL slug *" error={e.slug} help={`Page address: /projects/${slug || "…"}`}>
          <input
            id="slug"
            name="slug"
            required
            maxLength={80}
            value={slug}
            onChange={(ev) => {
              setSlugTouched(true);
              setSlug(ev.target.value.toLowerCase());
            }}
            className={inputClass}
            {...aria("slug")}
          />
        </Field>
        <Field name="tagline" label="Tagline" error={e.tagline}>
          <input id="tagline" name="tagline" maxLength={160} defaultValue={project?.tagline ?? ""} className={inputClass} {...aria("tagline")} />
        </Field>
        <Field name="category" label="Category" error={e.category}>
          <input id="category" name="category" maxLength={80} defaultValue={project?.category ?? ""} className={inputClass} {...aria("category")} />
        </Field>
        <Field name="description" label="Description" error={e.description} help="Separate paragraphs with a blank line." className="sm:col-span-2">
          <textarea
            id="description"
            name="description"
            rows={6}
            maxLength={5000}
            defaultValue={project?.description ?? ""}
            className={cn(inputClass, "resize-y")}
            {...aria("description")}
          />
        </Field>
        <Field name="status" label="Status *" error={e.status}>
          <select id="status" name="status" defaultValue={project?.status ?? "in_development"} className={inputClass} {...aria("status")}>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel[s]}
              </option>
            ))}
          </select>
        </Field>
        <Field name="tech_stack" label="Technology stack" help="Comma separated. Only list technologies you've verified." error={e.tech_stack}>
          <input id="tech_stack" name="tech_stack" defaultValue={project?.tech_stack.join(", ") ?? ""} className={inputClass} />
        </Field>
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-4 rounded-2xl border border-border-subtle bg-surface/60 p-5 sm:grid-cols-2">
        <legend className="px-1 text-sm font-semibold text-foreground">Links</legend>
        <Field name="website_url" label="Website URL" error={e.website_url} help="Leave blank unless the link works — no button is shown without it.">
          <input id="website_url" name="website_url" type="url" inputMode="url" placeholder="https://" defaultValue={project?.website_url ?? ""} className={inputClass} {...aria("website_url")} />
        </Field>
        <Field name="download_url" label="App download URL" error={e.download_url} help="App store or download page. Leave blank if not available.">
          <input id="download_url" name="download_url" type="url" inputMode="url" placeholder="https://" defaultValue={project?.download_url ?? ""} className={inputClass} {...aria("download_url")} />
        </Field>
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-4 rounded-2xl border border-border-subtle bg-surface/60 p-5 sm:grid-cols-2">
        <legend className="px-1 text-sm font-semibold text-foreground">Images</legend>
        <Field name="logo_url" label="Logo" error={e.logo_url} help="https:// URL, or a file in /public such as /projects/inventra-logo.png">
          <input id="logo_url" name="logo_url" defaultValue={project?.logo_url ?? ""} className={inputClass} {...aria("logo_url")} />
        </Field>
        <Field name="cover_url" label="Cover image" error={e.cover_url} help="Shown on cards and the project page.">
          <input id="cover_url" name="cover_url" defaultValue={project?.cover_url ?? ""} className={inputClass} {...aria("cover_url")} />
        </Field>
        <Field name="screenshots" label="Screenshots" error={e.screenshots} help="One image URL or /path per line (up to 12)." className="sm:col-span-2">
          <textarea id="screenshots" name="screenshots" rows={3} defaultValue={project?.screenshots.join("\n") ?? ""} className={cn(inputClass, "resize-y font-mono text-xs")} {...aria("screenshots")} />
        </Field>
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-4 rounded-2xl border border-border-subtle bg-surface/60 p-5 sm:grid-cols-2">
        <legend className="px-1 text-sm font-semibold text-foreground">Display & SEO</legend>
        <Field name="display_order" label="Display order" error={e.display_order} help="Lower numbers appear first.">
          <input id="display_order" name="display_order" type="number" min={0} max={10000} step={1} defaultValue={project?.display_order ?? 100} className={inputClass} {...aria("display_order")} />
        </Field>
        <div className="flex flex-col justify-center gap-3">
          <label className="flex items-center gap-2.5 text-sm text-foreground">
            <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} className="size-4 accent-[var(--gold)]" />
            Featured on the homepage
          </label>
          <label className="flex items-center gap-2.5 text-sm text-foreground">
            <input type="checkbox" name="published" defaultChecked={project?.published ?? false} className="size-4 accent-[var(--gold)]" />
            Published (visible on the public site)
          </label>
        </div>
        <Field name="seo_title" label="SEO title" error={e.seo_title} help="Defaults to the name and tagline.">
          <input id="seo_title" name="seo_title" maxLength={120} defaultValue={project?.seo_title ?? ""} className={inputClass} {...aria("seo_title")} />
        </Field>
        <Field name="seo_description" label="SEO description" error={e.seo_description} help="Defaults to the start of the description.">
          <textarea id="seo_description" name="seo_description" rows={2} maxLength={300} defaultValue={project?.seo_description ?? ""} className={cn(inputClass, "resize-y")} {...aria("seo_description")} />
        </Field>
      </fieldset>

      <div className="flex items-center gap-3">
        <SubmitButton>{project ? "Save changes" : "Create project"}</SubmitButton>
        {!project ? <p className={helpClass}>New projects start as drafts unless “Published” is ticked.</p> : null}
      </div>
    </form>
  );
}
