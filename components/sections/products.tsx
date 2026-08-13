import { SectionHeading } from "@/components/ui/section-heading";
import { ProductSection } from "@/components/sections/products/product-section";
import { InventraMockup } from "@/components/sections/products/inventra-mockup";
import { FraudShieldMockup } from "@/components/sections/products/fraudshield-mockup";
import { ForexAIMockup } from "@/components/sections/products/forex-ai-mockup";
import { inventra, fraudShield, forexAI } from "@/lib/data";

export function Products() {
  return (
    <section id="work" className="relative py-28 sm:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Featured Work"
          title="Products built end to end"
          description="Three platforms designed, architected, and shipped from the ground up — from database schema to the pixel a user touches."
        />

        <div className="mt-20 flex flex-col divide-y divide-border-subtle">
          <ProductSection product={inventra} mockup={<InventraMockup />} />
          <ProductSection
            product={fraudShield}
            mockup={<FraudShieldMockup />}
            reverse
          />
          <ProductSection product={forexAI} mockup={<ForexAIMockup />} />
        </div>
      </div>
    </section>
  );
}
