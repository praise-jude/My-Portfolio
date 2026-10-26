"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  FolderKanban,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/_actions/auth";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/content", label: "Pages & Content", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/seo", label: "SEO Settings", icon: Search },
  { href: "/admin/audit", label: "Audit Log", icon: History },
  { href: "/admin/settings", label: "Settings & Status", icon: Settings },
];

export function Sidebar({ email, unread }: { email: string; unread: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav aria-label="Admin" className="flex flex-1 flex-col gap-1">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active ? "bg-gold/10 text-gold-bright" : "text-muted hover:bg-white/[0.04] hover:text-foreground"
            )}
          >
            <Icon size={16} aria-hidden />
            <span className="flex-1">{label}</span>
            {href === "/admin/messages" && unread > 0 ? (
              <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold text-gold-bright">
                {unread}
                <span className="sr-only"> unread</span>
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="flex flex-col gap-2 border-t border-border-subtle pt-4">
      <Link
        href="/"
        target="_blank"
        className="focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground"
      >
        <ExternalLink size={16} aria-hidden /> View website
      </Link>
      <p className="truncate px-3 text-xs text-muted-dim" title={email}>
        {email}
      </p>
      <form action={logoutAction}>
        <button
          type="submit"
          className="focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/[0.04] hover:text-foreground"
        >
          <LogOut size={16} aria-hidden /> Log out
        </button>
      </form>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border-subtle bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <span className="text-sm font-semibold">
          J<span className="text-gold-bright">.</span>Ewah <span className="font-normal text-muted">Admin</span>
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="focus-ring flex size-9 items-center justify-center rounded-lg text-foreground"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div id="admin-mobile-nav" className="fixed inset-0 top-[57px] z-30 flex flex-col gap-4 bg-background p-4 lg:hidden">
          {nav}
          {footer}
        </div>
      ) : null}

      <aside className="sticky top-0 hidden h-[100svh] w-64 shrink-0 flex-col gap-6 border-r border-border-subtle bg-surface/50 p-4 lg:flex">
        <Link href="/admin" className="focus-ring px-3 pt-2 text-sm font-semibold">
          J<span className="text-gold-bright">.</span>Ewah <span className="font-normal text-muted">Admin</span>
        </Link>
        {nav}
        {footer}
      </aside>
    </>
  );
}
