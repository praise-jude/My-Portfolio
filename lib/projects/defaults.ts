import type { Project, ProjectStatus } from "./types";

type Seed = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  status: ProjectStatus;
  website_url?: string;
  featured?: boolean;
};

// Mirrors the seed rows in supabase/migrations/20261026000000_admin_cms_analytics.sql.
// Used only when the projects table can't be read, so the portfolio never
// renders empty. Once the database is up, /admin/projects is the source of truth.
const seeds: Seed[] = [
  {
    slug: "inventra",
    name: "Inventra",
    tagline: "Retail Operations Platform",
    description:
      "Inventory management, stock control, sales, business operations, and reporting for businesses — real-time stock, supplier orders, and profit analytics in one workspace.",
    category: "Business Management",
    status: "in_development",
    featured: true,
  },
  {
    slug: "fraudshield-ai",
    name: "FraudShield AI",
    tagline: "AI-Powered Trust & Risk Platform",
    description:
      "A fraud detection and anomaly-monitoring platform that scores transaction risk in real time, supports case management, and helps digital businesses act on suspicious activity.",
    category: "Security & AI",
    status: "in_development",
    featured: true,
  },
  {
    slug: "forex-ai",
    name: "Forex AI",
    tagline: "AI Market Intelligence Platform",
    description:
      "An AI-assisted forex analysis and trading automation project that monitors markets, reasons across multiple timeframes, and only surfaces a signal when the setup lines up.",
    category: "Financial Technology",
    status: "in_development",
    featured: true,
  },
  {
    slug: "royalman-digital-concepts",
    name: "Royalman Digital Concepts",
    tagline: "Digital business & technology brand",
    description:
      "My digital business and technology brand — the home for the products, services, and platforms I build.",
    category: "Brand",
    status: "in_development",
  },
  {
    slug: "royalman-cloud",
    name: "Royalman Cloud",
    tagline: "Domains, hosting & cloud",
    description: "A self-hosted infrastructure and hosting platform for domains, hosting, and cloud services.",
    category: "Cloud Infrastructure",
    status: "in_development",
    website_url: "https://royalmancloud.com",
  },
  {
    slug: "wealthora",
    name: "Wealthora",
    tagline: "Digital wealth platform",
    description: "A digital wealth platform concept.",
    category: "Financial Technology",
    status: "planned",
  },
  {
    slug: "wealthorabet",
    name: "WealthoraBet",
    tagline: "Betting & digital services",
    description: "A betting and digital services platform.",
    category: "Digital Services",
    status: "in_development",
  },
  {
    slug: "vidora-ai",
    name: "Vidora AI",
    tagline: "AI video creation",
    description: "An AI video creation project.",
    category: "Artificial Intelligence",
    status: "in_development",
  },
  {
    slug: "royal-vpn",
    name: "Royal-VPN",
    tagline: "VPN product",
    description: "A VPN product.",
    category: "Security",
    status: "in_development",
  },
];

export const fallbackProjects: Project[] = seeds.map((s, i) => ({
  id: `fallback-${s.slug}`,
  slug: s.slug,
  name: s.name,
  tagline: s.tagline,
  description: s.description,
  category: s.category,
  status: s.status,
  logo_url: null,
  cover_url: null,
  screenshots: [],
  tech_stack: [],
  website_url: s.website_url ?? null,
  download_url: null,
  featured: s.featured ?? false,
  display_order: i + 1,
  seo_title: null,
  seo_description: null,
  published: true,
  deleted_at: null,
  created_at: "2026-10-26T00:00:00.000Z",
  updated_at: "2026-10-26T00:00:00.000Z",
}));
