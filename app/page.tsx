import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Products } from "@/components/sections/products";
import { Expertise } from "@/components/sections/expertise";
import { Metrics } from "@/components/sections/metrics";
import { Philosophy } from "@/components/sections/philosophy";
import { Journey } from "@/components/sections/journey";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Products />
      <Metrics />
      <Expertise />
      <Philosophy />
      <Journey />
      <Testimonials />
      <Contact />
    </>
  );
}
