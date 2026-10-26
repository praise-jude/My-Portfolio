import { Reveal } from "@/components/ui/reveal";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden pb-16 pt-36 sm:pt-44">
      <div aria-hidden className="absolute inset-0 bg-grid mask-fade-radial opacity-40" />
      <div aria-hidden className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <div className="container-edge relative">
        <Reveal>
          <div className="flex items-center gap-2.5">
            <span className="size-1.5 rounded-full bg-gold-bright shadow-[0_0_12px_2px_rgba(232,200,114,0.6)]" />
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted">{eyebrow}</span>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-gradient sm:text-6xl">
            {title}
          </h1>
        </Reveal>
        {description ? (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">{description}</p>
          </Reveal>
        ) : null}
        {children}
      </div>
    </header>
  );
}
