import { describe, expect, it } from "vitest";
import { defaultContent } from "@/lib/content/defaults";
import { SECTION_KEYS, sectionSpecs, validateSection } from "@/lib/content/schema";
import { validateProjectForm } from "@/lib/projects/validate";
import { fallbackProjects } from "@/lib/projects/defaults";
import { validateContact } from "@/lib/contact/validate";
import { isImageSrc, slugify } from "@/lib/validation";

function form(fields: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
}

describe("content schema", () => {
  it.each(SECTION_KEYS)("built-in default for '%s' passes its own validation", (key) => {
    expect(validateSection(sectionSpecs[key], defaultContent[key])).toEqual({ ok: true, value: defaultContent[key] });
  });

  it("reports required fields and length limits", () => {
    const r = validateSection(sectionSpecs.hero, { fields: { headline: "", intro: "x".repeat(501) } });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors).toContain("Headline is required.");
      expect(r.errors).toContain("Introduction must be 500 characters or fewer.");
    }
  });

  it("only accepts http(s) social links", () => {
    const r = validateSection(sectionSpecs.socials, { items: [{ label: "X", url: "javascript:alert(1)" }] });
    expect(r.ok).toBe(false);
  });

  it("drops fully empty rows and enforces the item limit", () => {
    const ok = validateSection(sectionSpecs.socials, {
      items: [{ label: "", url: "" }, { label: "GitHub", url: "https://github.com/praise-jude" }],
    });
    expect(ok).toEqual({ ok: true, value: { fields: {}, items: [{ label: "GitHub", url: "https://github.com/praise-jude" }] } });

    const tooMany = validateSection(sectionSpecs.socials, {
      items: Array.from({ length: 11 }, (_, i) => ({ label: `L${i}`, url: `https://e.com/${i}` })),
    });
    expect(tooMany.ok).toBe(false);
  });

  it("treats garbage stored values as invalid rather than crashing", () => {
    expect(validateSection(sectionSpecs.hero, "nonsense").ok).toBe(false);
    expect(validateSection(sectionSpecs.skills, { items: "nope" })).toEqual({ ok: true, value: { fields: {}, items: [] } });
  });
});

describe("project form validation", () => {
  it("derives the slug from the name and normalises lists", () => {
    const r = validateProjectForm(form({ name: "Vidora AI", status: "planned", screenshots: "/a.png\n\n https://x.com/b.png " }));
    expect(r.ok && r.value).toMatchObject({ slug: "vidora-ai", screenshots: ["/a.png", "https://x.com/b.png"], published: false });
  });

  it("rejects unsafe or broken links and images", () => {
    const r = validateProjectForm(
      form({ name: "X", status: "live", download_url: "ftp://x", cover_url: "//evil.com/a.png", logo_url: "data:image/png;base64,AA" })
    );
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["cover_url", "download_url", "logo_url"]);
  });

  it("rejects unknown statuses, bad slugs and bad ordering", () => {
    const r = validateProjectForm(form({ name: "X", slug: "Bad Slug", status: "launched", display_order: "1.5" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["display_order", "slug", "status"]);
  });

  it("fallback projects never invent links", () => {
    for (const p of fallbackProjects) {
      expect(p.download_url).toBeNull();
      if (p.website_url) expect(p.website_url).toBe("https://royalmancloud.com");
    }
  });
});

describe("contact validation", () => {
  const ok = { name: "Ada", email: "ada@example.com", subject: "Hello", message: "I'd like to talk about a project.", elapsedMs: 9000 };

  it("accepts a normal message", () => {
    expect(validateContact(ok)).toEqual({ ok: true, value: { name: "Ada", email: "ada@example.com", subject: "Hello", message: ok.message } });
  });

  it("silently flags honeypot and too-fast submissions as spam", () => {
    expect(validateContact({ ...ok, website: "http://spam" })).toEqual({ ok: true, spam: true });
    expect(validateContact({ ...ok, elapsedMs: 300 })).toEqual({ ok: true, spam: true });
  });

  it("rejects invalid fields", () => {
    expect(validateContact({ ...ok, email: "nope" }).ok).toBe(false);
    expect(validateContact({ ...ok, message: "short" }).ok).toBe(false);
    expect(validateContact({ ...ok, subject: "x".repeat(201) }).ok).toBe(false);
    expect(validateContact("string").ok).toBe(false);
  });
});

describe("helpers", () => {
  it("slugify", () => {
    expect(slugify("  Royal-VPN!  ")).toBe("royal-vpn");
    expect(slugify("Café Déjà")).toBe("cafe-deja");
  });

  it("isImageSrc", () => {
    expect(isImageSrc("/profile.jpg")).toBe(true);
    expect(isImageSrc("https://cdn.example.com/a.png")).toBe(true);
    expect(isImageSrc("//evil.com/a.png")).toBe(false);
    expect(isImageSrc("javascript:alert(1)")).toBe(false);
  });
});
