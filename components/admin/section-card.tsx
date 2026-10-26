import type { SectionKey } from "@/lib/content/schema";
import { sectionSpecs } from "@/lib/content/schema";
import type { ContentLoad } from "@/lib/content/queries";
import { resetContentAction } from "@/app/admin/_actions/content";
import { Card } from "./ui";
import { SectionForm } from "./section-form";
import { ConfirmSubmit } from "./confirm-submit";

export function SectionCard({ section, load }: { section: SectionKey; load: ContentLoad }) {
  const spec = sectionSpecs[section];
  const stored = load.stored.has(section);
  return (
    <div id={section} className="scroll-mt-24">
      <Card
        title={spec.title}
        description={spec.description}
        actions={
          stored ? (
            <form action={resetContentAction}>
              <input type="hidden" name="section" value={section} />
              <ConfirmSubmit
                title={`Reset “${spec.title}”?`}
                message="Your saved edits for this section will be removed and the built-in default text will be shown instead."
                confirmLabel="Reset to default"
                className="focus-ring text-xs text-muted-dim hover:text-red-300"
              >
                Reset to default
              </ConfirmSubmit>
            </form>
          ) : null
        }
      >
        {/* key forces a fresh form (and list state) after a reset or external change */}
        <SectionForm key={`${section}-${stored}`} spec={spec} value={load.content[section]} isStored={stored} />
      </Card>
    </div>
  );
}
