import Link from "next/link";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { StatusBadge } from "@/components/projects/status-badge";
import type { Project } from "@/lib/projects/types";

const statusNote: Partial<Record<Project["status"], string>> = {
  planned: "This project is planned or a concept — it is not available yet.",
  in_development: "This project is in active development.",
  archived: "This project is archived and no longer maintained.",
};

export function ProjectDetail({ project }: { project: Project }) {
  const paragraphs = project.description.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const gallery = project.screenshots.filter((s) => s !== project.cover_url);

  return (
    <article className="pb-28 pt-32 sm:pt-40">
      <div className="container-edge">
        <Link
          href="/projects"
          className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={15} /> All projects
        </Link>

        <header className="mt-8 flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} />
            {project.category ? <Badge>{project.category}</Badge> : null}
          </div>
          <div className="flex items-center gap-4">
            {project.logo_url ? (
              <span className="relative size-14 shrink-0 overflow-hidden rounded-2xl border border-border-subtle bg-surface-raised">
                <SmartImage src={project.logo_url} alt="" fill sizes="56px" className="object-contain p-1.5" />
              </span>
            ) : null}
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-gradient sm:text-6xl">
              {project.name}
            </h1>
          </div>
          {project.tagline ? <p className="text-xl text-muted">{project.tagline}</p> : null}

          {project.website_url || project.download_url ? (
            <div className="mt-2 flex flex-wrap gap-3">
              {project.website_url ? (
                <Button asChild>
                  <a href={project.website_url} target="_blank" rel="noopener noreferrer">
                    Visit website <ExternalLink size={15} />
                  </a>
                </Button>
              ) : null}
              {project.download_url ? (
                <Button asChild variant="secondary">
                  <a href={project.download_url} target="_blank" rel="noopener noreferrer">
                    Download app <Download size={15} />
                  </a>
                </Button>
              ) : null}
            </div>
          ) : null}
        </header>

        {project.cover_url ? (
          <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-2xl border border-border-subtle bg-surface-raised">
            <SmartImage
              src={project.cover_url}
              alt={`${project.name} screenshot`}
              fill
              priority
              sizes="(min-width: 1408px) 1312px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_18rem]">
          <div className="flex max-w-3xl flex-col gap-5">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-pretty text-lg leading-relaxed text-foreground/85">
                {p}
              </p>
            ))}
            {statusNote[project.status] ? (
              <p className="rounded-xl border border-border-subtle bg-surface/60 px-4 py-3 text-sm text-muted">
                {statusNote[project.status]}
              </p>
            ) : null}
          </div>

          <aside className="flex flex-col gap-6">
            {project.tech_stack.length ? (
              <div>
                <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Technology</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.tech_stack.map((t) => (
                    <li key={t}>
                      <Badge>{t}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Interested?</h2>
              <Link
                href={`/contact?subject=${encodeURIComponent(project.name)}`}
                className="focus-ring mt-3 inline-flex text-sm font-medium text-gold-bright hover:underline"
              >
                Ask me about {project.name}
              </Link>
            </div>
          </aside>
        </div>

        {gallery.length ? (
          <section className="mt-16" aria-label="Screenshots">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Screenshots</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {gallery.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border-subtle bg-surface-raised"
                >
                  <SmartImage
                    src={src}
                    alt={`${project.name} screenshot ${i + 1}`}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
