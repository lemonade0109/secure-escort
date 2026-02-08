import React from "react";
import { getAllRequestsAction } from "@/lib/actions/requests/get-all-requests";
import GlowBackground from "@/components/shared/glow-background";
import Link from "next/link";
import { Metadata } from "next";
import RequestFilters from "@/components/requests/request-filters";
import RequestList from "@/components/requests/requests-list";
import { RequestDetailsProps } from "@/types";

export const metadata: Metadata = {
  title: "Requests - Secure Escort",
  description: "View and manage your service requests.",
};

type PageProps = {
  searchParams?: Promise<{ type?: string; status?: string }>;
};

export default async function RequestsPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const type = sp.type?.toUpperCase();
  const status = sp.status?.toUpperCase();

  const requests = await getAllRequestsAction({ type, status });
  const transformedRequests = requests.map((req) => ({
    ...req,
    details: req.details as RequestDetailsProps,
  }));

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 px-6 py-8 sm:py-10 mx-auto space-y-6 max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="text-xs tracking-widest uppercase text-white/50"
            >
              Dashboard
            </Link>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              Requests
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/70">
              View and manage your escort, delivery, and personal security
              requests.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={"/request"}
              className="px-4 py-3 text-sm font-medium text-black rounded-md bg-gold hover:bg-gold/90 text-center"
            >
              Create Request
            </Link>

            <Link
              href={"/tracking"}
              className="px-4 py-3 text-sm font-medium border rounded-md border-white/15 bg-white/3 hover:bg-white/6 text-center"
            >
              Track by Code
            </Link>
          </div>
        </div>

        <RequestFilters />

        <RequestList requests={transformedRequests} />
      </div>
    </main>
  );
}
