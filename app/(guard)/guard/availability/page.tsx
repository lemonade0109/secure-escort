import AvailabilityCard from "@/components/admin/availability-card";
import GlowBackground from "@/components/shared/glow-background";
import { getGuardAvailabilityBlocksAction } from "@/lib/actions/guard/get-availability";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import React from "react";

export default async function GuardAvailabilityPage() {
  const { session } = await requireVerifiedUser();
  const userName = session?.user?.name || "Guard";
  const userEmail = session?.user?.email || "";
  const userRole = session?.user?.role || "USER";
  const data = await getGuardAvailabilityBlocksAction();

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 max-w-5xl px-6 py-10 mx-auto">
        {data && (
          <AvailabilityCard
            data={data}
            name={userName}
            email={userEmail}
            role={userRole}
          />
        )}
      </div>
    </main>
  );
}
