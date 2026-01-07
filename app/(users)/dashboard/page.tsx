import React from "react";
import { Metadata } from "next";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import GlowBackground from "@/components/shared/glow-background";
import DashboardStats from "@/components/dashboard/dashboard-stats";
import RecentRequests from "@/components/dashboard/recent-requests";
import QuickActions from "@/components/dashboard/quick-actions";
import DashboardHeader from "@/components/dashboard/dashboard-header-v2";

export const metadata: Metadata = {
  title: "Dashboard - Secure Escort",
  description: "User dashboard for Secure Escort application.",
};

export default async function DashboardPage() {
  await requireVerifiedUser();
  return (
    <main className=" min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <DashboardHeader />

        <div className="mt-8">
          <DashboardStats />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentRequests />
          </div>

          <div className="space-y-6">
            <QuickActions />
          </div>
        </div>
      </div>
    </main>
  );
}
