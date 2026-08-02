export const site = {
  name: "Jude Omini Ewah",
  title: "Founder & Software Engineer",
  statement:
    "I build intelligent software that solves real-world business and security challenges.",
  email: "royalmandigitalconcept@gmail.com",
  url: "https://judeominiewah.dev",
  location: "Remote / Worldwide",
};

export const socials = [
  { label: "GitHub", href: "https://github.com/judeominiewah", key: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/judeominiewah", key: "linkedin" },
  { label: "X", href: "https://x.com/judeominiewah", key: "x" },
  { label: "Email", href: `mailto:${site.email}`, key: "mail" },
] as const;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Expertise", href: "#expertise" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
] as const;

export const aboutTimeline = [
  {
    year: "The Why",
    title: "Software as leverage",
    body: "I build software because it's the highest-leverage way to solve a problem once and let it keep solving it — for one business, or for thousands of people, forever.",
  },
  {
    year: "Philosophy",
    title: "Simple beats clever",
    body: "The best systems are the ones nobody notices. I optimize for clarity first — code that a tired engineer at 2am can still reason about.",
  },
  {
    year: "Approach",
    title: "Problem, then product",
    body: "I don't start with a stack. I start with a business problem, map the real workflow, and only then decide what to build and how.",
  },
  {
    year: "Craft",
    title: "Obsessed with the details",
    body: "The 200ms transition, the empty state, the error copy — the parts most teams skip are exactly the parts that make software feel trustworthy.",
  },
  {
    year: "Now",
    title: "Building with AI, for people",
    body: "I integrate AI where it removes real friction — not as a gimmick — while keeping systems secure, auditable, and built for actual businesses.",
  },
] as const;

export type ProductFeature = {
  icon: string;
  title: string;
  description: string;
};

export const royalInventra = {
  key: "royal-inventra",
  name: "Royal Inventra",
  tagline: "Modern SaaS Platform",
  description:
    "A complete operations platform for growing businesses — inventory, point of sale, invoicing, and analytics unified in one calm, fast interface.",
  accent: "electric" as const,
  metrics: [
    { label: "Modules", value: "10+" },
    { label: "Sync latency", value: "<200ms" },
    { label: "Uptime target", value: "99.9%" },
  ],
  features: [
    {
      icon: "Boxes",
      title: "Inventory Management",
      description: "Real-time stock tracking across locations with low-stock intelligence.",
    },
    {
      icon: "CreditCard",
      title: "Point of Sale",
      description: "Fast, offline-capable checkout built for real retail counters.",
    },
    {
      icon: "FileText",
      title: "Invoices",
      description: "Branded invoices generated, sent, and tracked automatically.",
    },
    {
      icon: "Wallet",
      title: "Expenses",
      description: "Categorized expense tracking tied directly to business reporting.",
    },
    {
      icon: "Users",
      title: "Customer Management",
      description: "A single source of truth for every customer relationship.",
    },
    {
      icon: "UsersRound",
      title: "Team Management",
      description: "Role-based access so every team member sees exactly what they need.",
    },
    {
      icon: "ShieldCheck",
      title: "Audit Logs",
      description: "Every action recorded — full accountability across the business.",
    },
    {
      icon: "BarChart3",
      title: "Business Analytics",
      description: "Live dashboards that turn operational data into decisions.",
    },
    {
      icon: "CloudCog",
      title: "Cloud Sync",
      description: "Instant, conflict-free sync across every device and location.",
    },
    {
      icon: "Smartphone",
      title: "Mobile Companion",
      description: "Run the business from your pocket, fully in sync with the desktop app.",
    },
    {
      icon: "Sparkles",
      title: "AI Assistance",
      description: "Contextual AI that drafts reports, flags anomalies, and answers questions.",
    },
  ] satisfies ProductFeature[],
};

export const fraudShield = {
  key: "fraudshield-ai",
  name: "FraudShield AI",
  tagline: "AI-Powered Trust & Risk Platform",
  description:
    "A real-time fraud intelligence layer that scores risk, verifies identity, and protects digital businesses at the speed of a transaction.",
  accent: "emerald" as const,
  metrics: [
    { label: "Signals analyzed", value: "120+" },
    { label: "Decision time", value: "<80ms" },
    { label: "Detection lift", value: "3.4x" },
  ],
  features: [
    {
      icon: "Radar",
      title: "Fraud Detection",
      description: "Pattern-based detection tuned to catch novel attacks, not just known ones.",
    },
    {
      icon: "Activity",
      title: "Behavior Analysis",
      description: "Continuous behavioral signals separate real users from bad actors.",
    },
    {
      icon: "Fingerprint",
      title: "Identity Verification",
      description: "Frictionless verification that stays invisible to legitimate users.",
    },
    {
      icon: "Gauge",
      title: "AI Risk Scoring",
      description: "Every event scored in real time with a transparent, explainable model.",
    },
    {
      icon: "ShieldHalf",
      title: "Digital Trust",
      description: "A composable trust score businesses can act on immediately.",
    },
    {
      icon: "MonitorCheck",
      title: "Real-time Monitoring",
      description: "Live event streams with instant alerting on emerging risk.",
    },
    {
      icon: "BrainCircuit",
      title: "Fraud Intelligence",
      description: "Aggregated intelligence that gets sharper with every signal it sees.",
    },
    {
      icon: "Search",
      title: "Investigation Dashboard",
      description: "Deep case tooling for analysts to investigate and resolve fast.",
    },
    {
      icon: "Globe2",
      title: "Global Protection",
      description: "Coverage built for cross-border transactions and distributed risk.",
    },
  ] satisfies ProductFeature[],
};

export const products = [royalInventra, fraudShield];

export const skills = [
  { name: "Next.js", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "PostgreSQL", category: "Data" },
  { name: "Supabase", category: "Data" },
  { name: "REST APIs", category: "Backend" },
  { name: "AI Integration", category: "AI" },
  { name: "Authentication", category: "Security" },
  { name: "Cloud Infrastructure", category: "Infra" },
  { name: "Mobile Development", category: "Frontend" },
  { name: "Animation Systems", category: "Frontend" },
  { name: "Performance Optimization", category: "Infra" },
] as const;

export const philosophy = [
  {
    icon: "Users",
    title: "Build for humans",
    description: "Every interface decision starts with how a real person will feel using it.",
  },
  {
    icon: "Zap",
    title: "Performance matters",
    description: "Speed is a feature. Slow software erodes trust before a user reads a word.",
  },
  {
    icon: "ShieldCheck",
    title: "Security first",
    description: "Security isn't a layer added later — it's a constraint present from line one.",
  },
  {
    icon: "Minus",
    title: "Simple beats complex",
    description: "Complexity is a cost paid by every future maintainer. I default to removing it.",
  },
  {
    icon: "Sparkle",
    title: "Elegant experiences",
    description: "Interfaces should feel inevitable — like there was never another way to build it.",
  },
  {
    icon: "Network",
    title: "Scalable architecture",
    description: "I design systems for the business you're becoming, not just the one you are.",
  },
  {
    icon: "Focus",
    title: "Attention to detail",
    description: "The unglamorous 1% — empty states, edge cases, timing — is where craft lives.",
  },
] as const;

export const metrics = [
  { label: "Projects Built", value: 24, suffix: "+" },
  { label: "Lines of Code", value: 480000, suffix: "+" },
  { label: "Problems Solved", value: 150, suffix: "+" },
  { label: "Features Delivered", value: 90, suffix: "+" },
  { label: "Ideas Prototyped", value: 60, suffix: "+" },
] as const;

export const experienceTimeline = [
  {
    phase: "Learning",
    title: "The foundation",
    period: "Origins",
    description:
      "Deep, deliberate study of computer science fundamentals, systems design, and software craftsmanship — building the judgment that shapes every decision since.",
  },
  {
    phase: "Building",
    title: "First real systems",
    period: "Early work",
    description:
      "Shipping production software for real users, learning that the hardest part of engineering is rarely the code — it's the tradeoffs around it.",
  },
  {
    phase: "Royal Inventra",
    title: "Founding a SaaS platform",
    period: "Product",
    description:
      "Designed and built a complete business operations platform from the ground up — architecture, product, and every pixel in between.",
  },
  {
    phase: "FraudShield AI",
    title: "Engineering digital trust",
    period: "Security & AI",
    description:
      "Built an AI-driven fraud and risk intelligence platform, merging security engineering with applied machine learning.",
  },
  {
    phase: "Future Vision",
    title: "What's next",
    period: "Ongoing",
    description:
      "Continuing to build intelligent, secure software for businesses — with AI as a core capability, not an afterthought.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "Our inventory used to be a spreadsheet held together by hope. Now it's real time across every location — and I finally trust the numbers.",
    label: "Business Owner",
  },
  {
    quote:
      "The POS just works, even when our internet doesn't. That single detail changed how our team feels about closing out every night.",
    label: "Retail Manager",
  },
  {
    quote:
      "We needed fraud protection that wouldn't slow down real customers. It caught what mattered and stayed invisible to everyone else.",
    label: "Startup Founder",
  },
  {
    quote:
      "Every workflow feels considered. It's rare to use software built by someone who has clearly done the actual job it's replacing.",
    label: "Beta User",
  },
] as const;
