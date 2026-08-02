"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "focus-ring group inline-flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-foreground",
        className
      )}
    >
      {email}
      <span className="flex size-6 items-center justify-center rounded-full border border-border-subtle transition-colors group-hover:border-border-strong">
        {copied ? (
          <Check size={12} className="text-emerald-bright" />
        ) : (
          <Copy size={12} />
        )}
      </span>
    </button>
  );
}
