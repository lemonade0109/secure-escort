import React from "react";
import ProfileEditCard from "./profile-edit-form-card";
import { getProfileAction } from "@/lib/actions/profile/get-profile";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import GlowBackground from "@/components/shared/glow-background";
import NavigationBar from "@/components/shared/navigationBar";

export default async function ProfileEditPage() {
  const { session } = await requireVerifiedUser();

  const data = await getProfileAction();
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 max-w-4xl px-6 py-8 sm:py-10 mx-auto">
        <div className="flex justify-between">
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

        <ProfileEditCard
          initial={{
            name: data?.name || null,
            email: data?.email || null,
            image: data?.image || null,
            phone: data?.phone || null,
            emergencyName: data?.emergencyName || null,
            emergencyPhone: data?.emergencyPhone || null,
          }}
        />
      </div>
    </main>
  );
}
