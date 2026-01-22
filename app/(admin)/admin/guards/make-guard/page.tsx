import MakeGuardCard from "@/components/admin/make-guard-card";
import GlowBackground from "@/components/shared/glow-background";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export default async function AdminGuardsPage() {
  const { session } = await requireVerifiedUser();
  const userIsAdmin = isAdmin(session?.user?.email || "");
  if (!userIsAdmin) return notFound();

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 max-w-3xl px-6 py-10 mx-auto">
        <div className="mb-4">
          <Link
            href="/admin/guards"
            className="text-xs tracking-widest uppercase text-white/50"
          >
            Admin ● Guards
          </Link>
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Create Guard Profile
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Promote a user into a guard and manage their profile.
          </p>
        </div>

        <MakeGuardCard />
      </div>
    </main>
  );
}
