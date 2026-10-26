import { requireAdmin } from "@/lib/auth/admin";
import { getUnreadCount } from "@/lib/admin/messages";
import { Sidebar } from "@/components/admin/sidebar";

// Admin pages always render per request with fresh data and auth.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const unread = await getUnreadCount();

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <Sidebar email={admin.email} unread={unread} />
      <main id="admin-main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">{children}</div>
      </main>
    </div>
  );
}
