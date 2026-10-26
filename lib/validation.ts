const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string) {
  return value.length <= 254 && EMAIL_RE.test(value);
}

/** Absolute http(s) URL only — rejects javascript:, data:, and other schemes. */
export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

/** http(s) URL or a site-relative path such as /images/cover.png. */
export function isImageSrc(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) {
    return /^\/[A-Za-z0-9\-._~/%]+$/.test(value);
  }
  return isHttpUrl(value);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export function isSlug(value: string) {
  return value.length <= 80 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
}

/** Trimmed string from FormData; non-string entries (files) become "". */
export function formString(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/** Comma- or newline-separated list, de-duplicated, empty items dropped. */
export function parseList(value: string, maxItems: number, maxLength: number) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of value.split(/[,\n]/)) {
    const item = raw.trim().slice(0, maxLength);
    if (item && !seen.has(item.toLowerCase())) {
      seen.add(item.toLowerCase());
      out.push(item);
    }
    if (out.length >= maxItems) break;
  }
  return out;
}
