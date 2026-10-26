import { isEmail } from "@/lib/validation";

/** Below this, a submission was almost certainly not typed by a person. */
export const MIN_FILL_MS = 2500;

export type ContactInput = { name: string; email: string; subject: string; message: string };

export type ContactValidation =
  | { ok: true; value: ContactInput }
  | { ok: true; spam: true }
  | { ok: false; error: string };

function str(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

export function validateContact(body: unknown): ContactValidation {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "Invalid request body." };
  }
  const b = body as Record<string, unknown>;

  // Spam signals get a fake success so bots learn nothing.
  if (str(b.website)) return { ok: true, spam: true };
  if (typeof b.elapsedMs === "number" && b.elapsedMs >= 0 && b.elapsedMs < MIN_FILL_MS) {
    return { ok: true, spam: true };
  }

  const name = str(b.name);
  const email = str(b.email);
  const subject = str(b.subject);
  const message = str(b.message);

  if (!name || name.length > 120) return { ok: false, error: "Please provide a valid name." };
  if (!email || !isEmail(email)) return { ok: false, error: "Please provide a valid email." };
  if (subject.length > 200) return { ok: false, error: "Subject must be 200 characters or fewer." };
  if (!message || message.length < 10 || message.length > 4000) {
    return { ok: false, error: "Message must be between 10 and 4000 characters." };
  }

  return { ok: true, value: { name, email, subject, message } };
}
