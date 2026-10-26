import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { AnalyticsOptOut } from "@/components/analytics/opt-out";
import { getContent } from "@/lib/content/queries";
import { site } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${site.name}'s website handles visitor analytics and contact messages.`,
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const { contact } = await getContent();

  return (
    <>
      <PageHeader eyebrow="Privacy" title="Privacy notice" description="Plain-language summary of what this website collects and why." />
      <div className="container-edge max-w-3xl pb-28">
        <div className="flex flex-col gap-10 text-pretty leading-relaxed text-foreground/85">
          <section>
            <h2 className="text-xl font-semibold text-foreground">Visitor analytics</h2>
            <p className="mt-3">
              This site counts page views with its own first-party analytics — no advertising or third-party
              tracking scripts. For each page view it records the page address, the website that referred you
              (domain only), any campaign tags in the link, a general device type (mobile, tablet or desktop),
              and an approximate country supplied by the hosting provider.
            </p>
            <p className="mt-3">
              To tell unique visitors and visits apart, your browser stores a random identifier and a visit
              identifier in local storage. They contain nothing about who you are. Your IP address is not
              stored. Automated traffic and the site owner&apos;s own visits are excluded.
            </p>
            <p className="mt-3">
              Analytics are not collected if your browser sends a Global Privacy Control or Do Not Track
              signal, or if you opt out below.
            </p>
            <div className="mt-5">
              <AnalyticsOptOut />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Contact form</h2>
            <p className="mt-3">
              When you send a message, your name, email, subject and message are stored so they can be read and
              answered. They are not shared or used for marketing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Questions or deletion requests</h2>
            <p className="mt-3">
              Email{" "}
              <a className="text-gold-bright underline-offset-4 hover:underline" href={`mailto:${contact.fields.email}`}>
                {contact.fields.email}
              </a>{" "}
              to ask about, or request deletion of, anything you have submitted.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
