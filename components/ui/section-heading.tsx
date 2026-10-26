import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  accent?: "gold" | "electric" | "emerald" | "neutral";
  className?: string;
};

const accentDot: Record<NonNullable<SectionHeadingProps["accent"]>, string> = {
  gold: "bg-gold-bright shadow-[0_0_12px_2px_rgba(232,200,114,0.6)]",
  electric: "bg-electric-bright shadow-[0_0_12px_2px_rgba(96,165,250,0.7)]",
  emerald: "bg-emerald-bright shadow-[0_0_12px_2px_rgba(52,211,153,0.7)]",
  neutral: "bg-muted",
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  accent = "gold",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <Reveal>
        <div className="flex items-center gap-2.5">
          <span className={cn("size-1.5 rounded-full", accentDot[accent])} />
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
            {eyebrow}
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={cn(
            "text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl",
            "text-gradient"
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={0.16}>
          <p
            className={cn(
              "max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
