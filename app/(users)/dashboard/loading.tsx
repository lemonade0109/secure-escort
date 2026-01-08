import DashboardHeaderLoading from "@/components/dashboard/loading/dashboard-header-loading";
import QuickActionsLoading from "@/components/dashboard/loading/quick-actions-loading";
import RecentRequestLoading from "@/components/dashboard/loading/recent-requests-loading";
import GlowBackground from "@/components/shared/glow-background";
import React from "react";

export default function LoadingPage() {
  return (
    <main className=" min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <DashboardHeaderLoading />

        <div className="mt-8">
          <DashboardHeaderLoading />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentRequestLoading requests={[]} />
          </div>

          <div className="space-y-6">
            <QuickActionsLoading />
          </div>
        </div>
      </div>
    </main>
  );
}
