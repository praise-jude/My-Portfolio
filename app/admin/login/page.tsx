import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth/admin";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getAdminUser()) redirect("/admin");

  return (
    <main className="relative flex flex-1 items-center justify-center px-4 py-16">
      <div aria-hidden className="absolute inset-0 bg-grid mask-fade-radial opacity-30" />
      <div className="glass relative w-full max-w-sm rounded-2xl p-7 sm:p-8">
        <p className="text-sm font-semibold tracking-tight text-foreground">
          J<span className="text-gold-bright">.</span>Ewah <span className="font-normal text-muted">· Admin</span>
        </p>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">Sign in</h1>
        <p className="mt-1.5 text-sm text-muted">Restricted to the site administrator.</p>
        <LoginForm />
        <Link href="/" className="focus-ring mt-6 inline-block text-xs text-muted-dim hover:text-foreground">
          ← Back to website
        </Link>
      </div>
    </main>
  );
}
