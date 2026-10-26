import { beforeEach, describe, expect, it, vi } from "vitest";
import { isAuthorizedAdmin, parseAdminEmails } from "@/lib/auth/allowlist";

// --- Mocks -----------------------------------------------------------------
const getUser = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser } }),
}));

class RedirectError extends Error {
  constructor(public url: string) {
    super(`NEXT_REDIRECT ${url}`);
  }
}
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new RedirectError(url);
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const insert = vi.fn();
const db = {
  from: vi.fn(() => ({
    insert: (row: unknown) => {
      insert(row);
      return {
        select: () => ({ single: async () => ({ data: { id: "0b6c7f4e-5f1a-4c2e-9d3b-1a2b3c4d5e6f" }, error: null }) }),
      };
    },
  })),
  rpc: vi.fn(async () => ({ data: true, error: null })),
};
vi.mock("@/lib/supabase/service", () => ({ createServiceClient: () => db }));
vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

// React's cache() is a no-op outside a server render; keep each test isolated.
vi.mock("react", async (orig) => ({ ...(await orig<typeof import("react")>()), cache: <T,>(fn: T) => fn }));

const { getAdminUser, requireAdmin } = await import("@/lib/auth/admin");
const { saveProjectAction } = await import("@/app/admin/_actions/projects");
const { GET: exportCsv } = await import("@/app/admin/(dashboard)/analytics/export/route");
const { NextRequest } = await import("next/server");

const confirmed = { id: "u1", email: "Jude@Example.com", email_confirmed_at: "2026-10-01T00:00:00Z" };

function projectForm(fields: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
}

beforeEach(() => {
  process.env.ADMIN_EMAILS = "jude@example.com, second@example.com";
  getUser.mockReset();
  insert.mockReset();
});

describe("allowlist", () => {
  it("parses a comma-separated, case-insensitive list", () => {
    expect(parseAdminEmails(" A@x.com, ,b@Y.com ")).toEqual(["a@x.com", "b@y.com"]);
    expect(parseAdminEmails(undefined)).toEqual([]);
  });

  it("requires an allowlisted AND confirmed email", () => {
    const list = ["jude@example.com"];
    expect(isAuthorizedAdmin(confirmed, list)).toBe(true);
    expect(isAuthorizedAdmin({ ...confirmed, email_confirmed_at: null }, list)).toBe(false);
    expect(isAuthorizedAdmin({ ...confirmed, email: "someone@else.com" }, list)).toBe(false);
    expect(isAuthorizedAdmin(confirmed, [])).toBe(false);
    expect(isAuthorizedAdmin(null, list)).toBe(false);
  });
});

describe("server-side admin guard", () => {
  it("rejects signed-out visitors", async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: null });
    expect(await getAdminUser()).toBeNull();
    await expect(requireAdmin()).rejects.toMatchObject({ url: "/admin/login" });
  });

  it("rejects signed-in users who are not administrators", async () => {
    getUser.mockResolvedValue({ data: { user: { ...confirmed, email: "visitor@example.com" } }, error: null });
    await expect(requireAdmin()).rejects.toMatchObject({ url: "/admin/login" });
  });

  it("rejects an allowlisted address whose ownership is unconfirmed", async () => {
    getUser.mockResolvedValue({ data: { user: { ...confirmed, email_confirmed_at: null } }, error: null });
    await expect(requireAdmin()).rejects.toMatchObject({ url: "/admin/login" });
  });

  it("fails closed when the auth service errors", async () => {
    getUser.mockRejectedValue(new Error("network"));
    expect(await getAdminUser()).toBeNull();
  });

  it("admits a confirmed, allowlisted administrator", async () => {
    getUser.mockResolvedValue({ data: { user: confirmed }, error: null });
    expect(await requireAdmin()).toEqual({ id: "u1", email: "Jude@Example.com" });
  });
});

describe("admin actions and APIs enforce authorization", () => {
  it("project creation is refused for non-admins and writes nothing", async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(saveProjectAction({}, projectForm({ name: "Hack", status: "live" }))).rejects.toMatchObject({
      url: "/admin/login",
    });
    expect(insert).not.toHaveBeenCalled();
  });

  it("project creation validates input before writing", async () => {
    getUser.mockResolvedValue({ data: { user: confirmed }, error: null });
    const result = await saveProjectAction(
      {},
      projectForm({ name: "Test", status: "live", website_url: "javascript:alert(1)" })
    );
    expect(result.errors?.website_url).toBeDefined();
    expect(insert).not.toHaveBeenCalled();
  });

  it("an admin can create a project, which is stored and then redirected to", async () => {
    getUser.mockResolvedValue({ data: { user: confirmed }, error: null });
    await expect(
      saveProjectAction(
        {},
        projectForm({
          name: "Royal Inventra Pro",
          status: "in_development",
          description: "Inventory for retailers.",
          tech_stack: "Next.js, Supabase, next.js",
          published: "on",
        })
      )
    ).rejects.toMatchObject({ url: "/admin/projects/0b6c7f4e-5f1a-4c2e-9d3b-1a2b3c4d5e6f?saved=1" });

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: "royal-inventra-pro",
        name: "Royal Inventra Pro",
        status: "in_development",
        tech_stack: ["Next.js", "Supabase"],
        published: true,
        featured: false,
        website_url: null,
      })
    );
  });

  it("the CSV export API returns 401 without an admin session", async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: null });
    const res = await exportCsv(new NextRequest("https://www.jude-omini-ewah.com.ng/admin/analytics/export"));
    expect(res.status).toBe(401);
  });
});
