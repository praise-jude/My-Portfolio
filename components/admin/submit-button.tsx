"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubmitButton({ children, pendingLabel = "Saving…" }: { children: ReactNode; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending} aria-disabled={pending}>
      {pending ? <Loader2 size={14} className="animate-spin" /> : null}
      {pending ? pendingLabel : children}
    </Button>
  );
}
