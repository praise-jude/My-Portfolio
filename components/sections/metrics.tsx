import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { metrics } from "@/lib/data";

export function Metrics() {
  return (
    <section className="relative border-y border-border-subtle py-20 sm:py-24">
      <div className="container-edge">
        <Reveal className="mb-12 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
            By the numbers
          </span>
        </Reveal>

        <StaggerGroup
          className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5"
          stagger={0.08}
        >
          {metrics.map((metric) => (
            <StaggerItem key={metric.label} className="flex flex-col items-center gap-2 text-center">
              <p className="text-gradient-accent text-3xl font-semibold tabular-nums sm:text-4xl md:text-5xl">
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </p>
              <p className="text-xs text-muted sm:text-sm">{metric.label}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
