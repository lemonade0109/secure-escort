import AdminRecentRequestsTable from "@/components/admin/admin-recent-request-table";
import AdminStats from "@/components/admin/admin-stats";
import UserMenu from "@/components/dashboard/user-menu";
import GlowBackground from "@/components/shared/glow-background";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { Bell } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminDashboardPage() {
  const { session } = await requireVerifiedUser();
  const userIsAdmin = isAdmin(session?.user?.email);
  if (!userIsAdmin) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 px-6 py-10 mx-auto space-y-6 max-w-7xl">
        <div className="flex justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-white/50">
              Admin Dashboard
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              Operations Dashboard
            </h1>
            <p className="mt-2 text-sm text-white/70">
              Monitor requests, assign guards, and update statuses.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              aria-label="Notifications"
              className="inline-flex items-center justify-center border rounded-lg size-9 border-white/10 bg-white/3 text-white/80 hover:bg-white/6"
            >
              <Bell className="size-4" />
            </button>
            <UserMenu name={session?.user?.name} email={session?.user?.email} />
          </div>
        </div>
        <AdminStats />
        <AdminRecentRequestsTable />
      </div>
    </main>
  );
}
