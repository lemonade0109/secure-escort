import React from "react";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import GlowBackground from "@/components/shared/glow-background";
import DashboardStats from "@/components/dashboard/dashboard-stats";
import RecentRequests from "@/components/dashboard/recent-requests";
import QuickActions from "@/components/dashboard/quick-actions";
import DashboardHeader from "@/components/dashboard/dashboard-header-main";
import { getRequestAction } from "@/lib/actions/requests/get-requests";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Secure Escort",
  description: "User dashboard for Secure Escort application.",
};

export default async function DashboardPage() {
  await requireVerifiedUser();

  const data = await getRequestAction();
  return (
    <main className=" min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 px-6 py-10 mx-auto max-w-7xl">
        <DashboardHeader />

        <div className="mt-8">
          <DashboardStats stats={data.stats} />
        </div>

        <div className="grid gap-6 mt-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentRequests
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              requests={data.recent.map((req: any) => ({
                ...req,
                pickup: req.details?.pickup,
                dropoff: req.details?.dropoff,
              }))}
            />
          </div>

          <div className="space-y-6">
            <QuickActions />
          </div>
        </div>
      </div>
    </main>
  );
}
