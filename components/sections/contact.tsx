import { MapPin, Mail } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { CopyEmail } from "@/components/ui/copy-email";
import { ContactForm } from "@/components/sections/contact-form";
import { SocialLinks } from "@/components/ui/social-links";
import type { SiteContent } from "@/lib/content/queries";

type ContactProps = {
  content: SiteContent;
  defaultSubject?: string;
  headingLevel?: "h1" | "h2";
};

export function Contact({ content, defaultSubject, headingLevel = "h2" }: ContactProps) {
  const Heading = headingLevel;
  const { email, location, availability } = content.contact.fields;

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
              <Heading className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                Let&apos;s build something
                <span className="text-gradient-gold"> worth shipping.</span>
              </Heading>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="max-w-md text-pretty text-lg leading-relaxed text-muted">
                {availability ||
                  "Have a product, platform, or business problem that needs real engineering? I'm always open to a conversation."}
              </p>
            </Reveal>

            <Reveal delay={0.18} className="mt-4 flex flex-col gap-5">
              <div className="flex items-center gap-2 text-foreground/90">
                <Mail size={16} className="text-gold-bright" />
                <CopyEmail email={email} />
              </div>
              {location ? (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <MapPin size={16} className="text-gold-bright" />
                  {location}
                </div>
              ) : null}

              <SocialLinks
                links={content.socials.items.map((s) => ({ label: s.label, url: s.url }))}
                itemClassName="glass"
              />
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <ContactForm defaultSubject={defaultSubject} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
