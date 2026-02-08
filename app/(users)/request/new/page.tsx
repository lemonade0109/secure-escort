import GlowBackground from "@/components/shared/glow-background";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { redirect } from "next/navigation";
import React from "react";
import NewRequestForm from "./request-new-form";
import { Metadata } from "next";
import { RequestType } from "@/types";

export const metadata: Metadata = {
  title: "New Request - Secure Escort",
  description: "Create a new service request.",
};

export const dynamic = "force-dynamic";

export default async function NewRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await requireVerifiedUser();

  const type = (await searchParams).type as RequestType | undefined;

  if (!type || !["PERSONAL_SECURITY", "ESCORT", "DELIVERY"].includes(type)) {
    redirect("/request");
  }
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 max-w-3xl px-6 py-8 sm:py-10 mx-auto">
        <NewRequestForm type={type} />
      </div>
    </main>
  );
}
