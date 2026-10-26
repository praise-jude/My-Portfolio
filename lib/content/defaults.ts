import { experienceTimeline, site, skills, socials } from "@/lib/data";
import type { SectionKey, SectionValue } from "./schema";

const intro =
  "I am Jude Omini Ewah, an entrepreneur and digital product builder passionate about creating practical technology solutions across business management, artificial intelligence, financial technology, digital services, and cloud infrastructure.";

/**
 * Content shown until (and unless) it is edited in /admin/content. Also the
 * fallback whenever the database is unreachable, so the public site always
 * renders.
 */
export const defaultContent: Record<SectionKey, SectionValue> = {
  hero: {
    fields: {
      eyebrow: "Entrepreneur · Founder · Digital Product Builder",
      headline: "Building Digital Products. Solving Real Problems. Creating Opportunities.",
      intro,
    },
    items: [],
  },
  about: {
    fields: {
      summary:
        "I work where entrepreneurship meets software — designing and building digital products for business management, artificial intelligence, financial technology, digital services, and cloud infrastructure. Royalman Digital Concepts is the brand I build them under.",
      body: [
        intro,
        "I build software because it's the highest-leverage way to solve a problem once and let it keep solving it — for one business, or for thousands of people. I don't start with a stack. I start with a business problem, map the real workflow, and only then decide what to build and how.",
        "I integrate AI where it removes real friction — not as a gimmick — while keeping systems secure, auditable, and built for actual businesses.",
        "Royalman Digital Concepts is my digital business and technology brand: the home for products such as Inventra, FraudShield AI, Forex AI, and Royalman Cloud.",
      ].join("\n\n"),
      photoUrl: "",
      quote:
        "I don't just write code — I design, architect, and ship software that real businesses depend on.",
    },
    items: [],
  },
  services: {
    fields: {
      intro:
        "Have a product, platform, or business problem that needs real engineering? Here's how we can work together.",
    },
    items: [
      {
        title: "Product development",
        description:
          "Designing and building web and mobile products end to end — from the database schema to the interface people use.",
      },
      {
        title: "Business software",
        description:
          "Inventory, sales, operations, and reporting systems shaped around how a business actually runs.",
      },
      {
        title: "AI integration",
        description:
          "Adding AI where it removes real friction — analysis, automation, and assistance — while keeping systems auditable.",
      },
      {
        title: "Partnerships & collaboration",
        description:
          "Working with founders, businesses, and teams on new digital products and opportunities.",
      },
    ],
  },
  interests: {
    fields: {},
    items: [
      { title: "Business management", description: "Operations, inventory, and reporting tools for real businesses." },
      { title: "Artificial intelligence", description: "Applied AI for analysis, automation, and content creation." },
      { title: "Financial technology", description: "Market intelligence, fraud detection, and digital wealth." },
      { title: "Digital services", description: "Platforms that deliver services to people online." },
      { title: "Cloud infrastructure", description: "Self-hosted domains, hosting, and cloud services." },
    ],
  },
  skills: {
    fields: {},
    items: skills.map((s) => ({ name: s.name, category: s.category })),
  },
  journey: {
    fields: {},
    items: experienceTimeline.map((s) => ({
      phase: s.phase,
      period: s.period,
      title: s.title,
      description: s.description,
    })),
  },
  contact: {
    fields: {
      email: site.email,
      location: site.location,
      availability: "Open to collaborations, partnerships, and project conversations.",
    },
    items: [],
  },
  socials: {
    fields: {},
    items: socials
      .filter((s) => s.key !== "mail")
      .map((s) => ({ label: s.label, url: s.href })),
  },
  seo: {
    fields: {
      title: `${site.name} — Entrepreneur & Digital Product Builder`,
      description: intro,
      keywords: [
        "Jude Omini Ewah",
        "Royalman Digital Concepts",
        "Entrepreneur",
        "Founder",
        "Digital Product Builder",
        "Inventra",
        "FraudShield AI",
        "Forex AI",
        "Royalman Cloud",
        "Software Engineer",
      ].join(", "),
    },
    items: [],
  },
};
