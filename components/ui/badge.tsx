import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  accent?: "gold" | "electric" | "emerald" | "amber" | "neutral";
};

const accentClasses: Record<NonNullable<BadgeProps["accent"]>, string> = {
  gold: "text-gold-bright border-gold/30 bg-gold/10",
  electric: "text-electric-bright border-electric/30 bg-electric/10",
  emerald: "text-emerald-bright border-emerald/30 bg-emerald/10",
  amber: "text-amber-bright border-amber/30 bg-amber/10",
  neutral: "text-muted border-border-subtle bg-white/[0.03]",
};

export function Badge({ children, className, accent = "neutral" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
        accentClasses[accent],
        className
      )}
    >
      {children}
    </span>
  );
}
