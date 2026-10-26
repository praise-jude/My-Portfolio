import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateContact } from "@/lib/contact/validate";
import { rateLimit } from "@/lib/security/rate-limit";
import { hashedClientKey } from "@/lib/security/hash";

const MAX_BODY_BYTES = 10_000;

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Message is too long." }, { status: 413 });
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Message is too long." }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  if ("spam" in result) {
    return NextResponse.json({ success: true });
  }

  if (!(await rateLimit(`contact:${hashedClientKey(request.headers)}`, 600, 5))) {
    return NextResponse.json(
      { error: "Too many messages in a short time. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const { name, email, subject, message } = result.value;

  // Inserts use the publishable key and the existing "Allow anonymous
  // inserts" RLS policy — unchanged from before the admin upgrade.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let { error: dbError } = await supabase
    .from("contact_submissions")
    .insert({ name, email, subject: subject || null, message });

  // Before the 2026-10-26 migration runs there is no subject column. Keep the
  // form working by folding the subject into the message.
  if (dbError && (dbError.code === "PGRST204" || /subject/i.test(dbError.message))) {
    ({ error: dbError } = await supabase.from("contact_submissions").insert({
      name,
      email,
      message: subject ? `Subject: ${subject}\n\n${message}`.slice(0, 4000) : message,
    }));
  }

  if (dbError) {
    console.error("[contact] failed to store submission", dbError);
    return NextResponse.json(
      { error: "Message could not be sent right now. Please email directly." },
      { status: 502 }
    );
  }

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "royalmandigitalconcept@gmail.com";

  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>",
          to: [toEmail],
          reply_to: email,
          subject: subject ? `[Website] ${subject}`.slice(0, 200) : `New inquiry from ${name}`,
          text: `From: ${name} <${email}>\nSubject: ${subject || "(none)"}\n\n${message}`,
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        throw new Error(`Resend responded with ${res.status}`);
      }
    } catch (error) {
      // Submission is already safely stored in Supabase — email is a
      // best-effort notification, so its failure shouldn't fail the request.
      console.error("[contact] failed to send notification email", error);
    }
  }

  return NextResponse.json({ success: true });
}
