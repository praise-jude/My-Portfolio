import Link from "next/link";
import { SmartImage as Image } from "@/components/ui/smart-image";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/projects/status-badge";
import type { Project } from "@/lib/projects/types";

export function ProjectCard({ project }: { project: Project }) {
  const initials = project.name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface/60 transition-colors duration-300 hover:border-gold/40">
      {project.cover_url ? (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-border-subtle bg-surface-raised">
          <Image
            src={project.cover_url}
            alt={`${project.name} screenshot`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {project.logo_url ? (
              <span className="relative size-10 shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-surface-raised">
                <Image src={project.logo_url} alt="" fill sizes="40px" className="object-contain p-1" />
              </span>
            ) : (
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 text-sm font-semibold text-gold-bright"
              >
                {initials}
              </span>
            )}
            <div>
              <h3 className="text-lg font-semibold leading-tight text-foreground">
                <Link
                  href={`/projects/${project.slug}`}
                  className="focus-ring after:absolute after:inset-0 after:content-['']"
                >
                  {project.name}
                </Link>
              </h3>
              {project.tagline ? <p className="mt-0.5 text-xs text-muted-dim">{project.tagline}</p> : null}
            </div>
          </div>
          <ArrowUpRight
            size={16}
            aria-hidden
            className="mt-1 shrink-0 text-muted-dim transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-bright"
          />
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{project.description}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <StatusBadge status={project.status} />
          {project.category ? <Badge>{project.category}</Badge> : null}
        </div>
      </div>
    </article>
  );
}
