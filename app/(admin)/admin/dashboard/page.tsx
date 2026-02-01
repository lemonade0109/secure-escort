import AdminRecentRequestsTable from "@/components/admin/admin-recent-request-table";
import AdminStats from "@/components/admin/admin-stats";
import GlowBackground from "@/components/shared/glow-background";
import NavigationBar from "@/components/shared/navigationBar";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Operations Dashboard | Admin | Secure Escort",
  description:
    "Monitor requests, assign guards, and update statuses from the admin operations dashboard.",
};

export default async function AdminDashboardPage() {
  const { session } = await requireVerifiedUser();
  const userIsAdmin = isAdmin(session?.user?.email || "");
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
            <NavigationBar
              userName={session?.user?.name || ""}
              userEmail={session?.user?.email || ""}
            />
          </div>
        </div>
        <AdminStats />
        <AdminRecentRequestsTable />
      </div>
    </main>
  );
}
