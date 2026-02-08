import ProfileCard from "@/components/profile/profile-card";
import GlowBackground from "@/components/shared/glow-background";
import NavigationBar from "@/components/shared/navigationBar";
import { getProfileAction } from "@/lib/actions/profile/get-profile";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Profile - Secure Escort",
  description: "Manage your profile details and role information.",
};

export default async function ProfilePage() {
  const { session } = await requireVerifiedUser();
  const isAdminUser = isAdmin(session.user.email);

  const data = await getProfileAction();
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 max-w-4xl px-6 py-8 sm:py-10 mx-auto">
        <div className="flex  justify-between">
          <div className="mb-2 sm:mb-6">
            <p className="text-xs tracking-widest uppercase text-white/50">
              Account
            </p>
            <h1 className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold">
              Profile
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/70">
              View your account details and role access.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:mt-1">
            <NavigationBar role={session?.user.role || "USER"} />
          </div>
        </div>

        <ProfileCard
          name={data?.name || ""}
          email={data?.email || ""}
          role={session?.user?.role || "USER"}
          userIsAdmin={isAdminUser}
        />
      </div>
    </main>
  );
}
