import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div aria-hidden className="absolute inset-0 bg-grid mask-fade-radial opacity-40" />
      <div aria-hidden className="absolute h-72 w-72 rounded-full bg-gold/10 blur-[120px]" />
      <div className="relative flex flex-col items-center">
        <p className="font-mono text-sm tracking-[0.3em] text-gold-bright">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gradient sm:text-5xl">
          This page doesn&apos;t exist
        </h1>
        <p className="mt-4 max-w-md text-muted">
          The link may be old or mistyped. Here are some places to go instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/projects">Projects</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/contact">Contact</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
