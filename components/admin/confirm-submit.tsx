"use client";

import { useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

type ConfirmSubmitProps = {
  children: ReactNode;
  title: string;
  message: string;
  confirmLabel?: string;
  tone?: "danger" | "default";
  className?: string;
};

/**
 * Submit button for a destructive form action. Opens an accessible native
 * <dialog> (focus-trapped, Esc to cancel) before the form is submitted.
 */
export function ConfirmSubmit({
  children,
  title,
  message,
  confirmLabel = "Confirm",
  tone = "danger",
  className,
}: ConfirmSubmitProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const { pending } = useFormStatus();

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => dialogRef.current?.showModal()}
        className={className}
      >
        {children}
      </button>
      <button ref={submitRef} type="submit" hidden aria-hidden tabIndex={-1} />
      <dialog
        ref={dialogRef}
        className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-border-strong bg-surface-raised p-6 text-foreground backdrop:bg-black/60"
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            autoFocus
            onClick={() => dialogRef.current?.close()}
            className="focus-ring rounded-lg border border-border-subtle px-4 py-2 text-sm text-muted hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              dialogRef.current?.close();
              submitRef.current?.click();
            }}
            className={cn(
              "focus-ring rounded-lg px-4 py-2 text-sm font-medium",
              tone === "danger" ? "bg-red-500/90 text-white hover:bg-red-500" : "bg-gold-bright text-background hover:bg-gold"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </dialog>
    </>
  );
}
