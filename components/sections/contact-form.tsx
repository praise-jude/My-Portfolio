"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm({ defaultSubject = "" }: { defaultSubject?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  // When the form became usable; submissions faster than a human could type are rejected server-side.
  const startedAt = useRef(0);
  const subjectRef = useRef<HTMLInputElement>(null);

  // Prefill from ?subject= (e.g. "Ask me about Inventra") without making the page dynamic.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("subject");
    if (fromUrl && subjectRef.current && !subjectRef.current.value) {
      subjectRef.current.value = fromUrl.slice(0, 200);
    }
  }, []);

  useEffect(() => {
    startedAt.current = Date.now();
  }, [status]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
      elapsedMs: Date.now() - startedAt.current,
    };

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.error ?? "Something went wrong.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const fieldClass =
    "focus-ring w-full rounded-xl border border-border-subtle bg-white/[0.02] px-4 py-3.5 text-sm text-foreground placeholder:text-muted-dim transition-colors duration-200 focus:border-gold/50";

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-start gap-3 rounded-2xl border border-emerald/30 bg-emerald/5 p-8"
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-emerald/15 text-emerald-bright">
          <Check size={20} />
        </span>
        <h3 className="text-xl font-semibold text-foreground">Message sent</h3>
        <p className="text-sm text-muted">
          Thanks for reaching out — I&apos;ll get back to you within a couple of days.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="focus-ring mt-2 text-sm font-medium text-gold-bright hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-medium text-muted">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            placeholder="Your name"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-medium text-muted">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-xs font-medium text-muted">
          Subject
        </label>
        <input
          ref={subjectRef}
          id="subject"
          name="subject"
          type="text"
          required
          maxLength={200}
          defaultValue={defaultSubject}
          placeholder="What is this about?"
          className={fieldClass}
        />
      </div>

      {/* Honeypot: hidden from people and assistive tech, often filled by bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-medium text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={5}
          placeholder="Tell me a little about what you're building..."
          className={cn(fieldClass, "resize-none")}
        />
      </div>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-red-400"
            role="alert"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        size="lg"
        disabled={status === "loading"}
        className="mt-2 w-fit"
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === "loading" ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Loader2 size={16} className="animate-spin" />
              Sending...
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              Send message
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </form>
  );
}
