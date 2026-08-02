import { SectionHeading } from "@/components/ui/section-heading";
import { ProductSection } from "@/components/sections/products/product-section";
import { RoyalInventraMockup } from "@/components/sections/products/royal-inventra-mockup";
import { FraudShieldMockup } from "@/components/sections/products/fraudshield-mockup";
import { royalInventra, fraudShield } from "@/lib/data";

export function Products() {
  return (
    <section id="work" className="relative py-28 sm:py-36">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Featured Work"
          title="Products built end to end"
          description="Two platforms designed, architected, and shipped from the ground up — from database schema to the pixel a user touches."
        />

        <div className="mt-20 flex flex-col divide-y divide-border-subtle">
          <ProductSection product={royalInventra} mockup={<RoyalInventraMockup />} />
          <ProductSection
            product={fraudShield}
            mockup={<FraudShieldMockup />}
            reverse
          />
        </div>
      </div>
    </section>
  );
}
