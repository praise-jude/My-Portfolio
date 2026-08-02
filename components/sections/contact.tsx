import type { ComponentType } from "react";
import { Mail } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { CopyEmail } from "@/components/ui/copy-email";
import { ContactForm } from "@/components/sections/contact-form";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/social-icons";
import { site, socials } from "@/lib/data";

const socialIcon: Record<string, ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  x: XIcon,
  mail: Mail,
};

export function Contact() {
  return (
    <section id="contact" className="relative py-28 sm:py-36">
      <div className="container-edge">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-6">
            <Reveal>
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
                Get in touch
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                Let&apos;s build something
                <span className="text-gradient-accent"> worth shipping.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="max-w-md text-pretty text-lg leading-relaxed text-muted">
                Have a product, platform, or business problem that needs real
                engineering? I&apos;m always open to a conversation.
              </p>
            </Reveal>

            <Reveal delay={0.18} className="mt-4 flex flex-col gap-5">
              <div className="flex items-center gap-2 text-foreground/90">
                <Mail size={16} className="text-electric-bright" />
                <CopyEmail email={site.email} />
              </div>

              <div className="flex items-center gap-3">
                {socials.map((s) => {
                  const Icon = socialIcon[s.key];
                  return (
                    <a
                      key={s.key}
                      href={s.href}
                      target={s.key === "mail" ? undefined : "_blank"}
                      rel={s.key === "mail" ? undefined : "noopener noreferrer"}
                      aria-label={s.label}
                      className="focus-ring glass flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:text-electric-bright"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
