import type { ComponentType } from "react";
import { Globe, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/social-icons";
import { cn } from "@/lib/utils";

const icons: Record<string, ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  x: XIcon,
  twitter: XIcon,
  email: Mail,
};

type SocialLinksProps = {
  links: { label: string; url: string }[];
  email?: string;
  className?: string;
  itemClassName?: string;
};

export function SocialLinks({ links, email, className, itemClassName }: SocialLinksProps) {
  const all = email ? [...links, { label: "Email", url: `mailto:${email}` }] : links;

  return (
    <ul className={cn("flex flex-wrap items-center gap-3", className)}>
      {all.map((s) => {
        const Icon = icons[s.label.trim().toLowerCase()] ?? Globe;
        const external = !s.url.startsWith("mailto:");
        return (
          <li key={s.url}>
            <a
              href={s.url}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer me" : undefined}
              aria-label={s.label}
              title={s.label}
              className={cn(
                "focus-ring flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:text-gold-bright",
                itemClassName
              )}
            >
              <Icon className="size-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
