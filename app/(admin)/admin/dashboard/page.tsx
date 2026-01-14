import AdminRequestsTable from "@/components/admin/admin-requests-table";
import AdminStats from "@/components/admin/admin-stats";
import GlowBackground from "@/components/shared/glow-background";
import { getAdminRequests } from "@/lib/actions/admin/admin-requests";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
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

        <AdminStats />
        <AdminRequestsTable />
      </div>
    </main>
  );
}
