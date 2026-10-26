import { SectionHeading } from "@/components/ui/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { SkillTile } from "@/components/ui/skill-tile";
type Skill = { name: string; category: string };

export function Expertise({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;

  return (
    <section id="expertise" className="relative py-28 sm:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Skills & Focus"
          title="A technology ecosystem, not a list of logos"
          description="The tools I reach for depend on the problem — here's the ecosystem I build with most, spanning product, data, and infrastructure."
        />

        <StaggerGroup
          className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          stagger={0.04}
        >
          {skills.map((skill) => (
            <StaggerItem key={skill.name} y={16}>
              <SkillTile name={skill.name} category={skill.category} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
