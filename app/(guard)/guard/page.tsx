import React from "react";
import { Metadata } from "next";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getGuardJobByIdAction } from "@/lib/actions/guard/get-guard-job-id";
import GlowBackground from "@/components/shared/glow-background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guard - Secure Escort",
};

export default async function GuardPage() {
  const { session } = await requireVerifiedUser();
  const guardId = session?.user?.id as string;

  const jobs = await getGuardJobByIdAction(guardId);
  return (
    <main className="min-h-screen overflow-hidden bg-[#070a12] text-white px-6 py-10">
      <GlowBackground intensity="medium" />
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">My Jobs</h1>

        <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Assigned Requests</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {jobs.length === 0 ? (
              <p className="text-sm text-white/70">No jobs assigned yet.</p>
            ) : (
              jobs.map((job) => (
                <Link
                  href={`/guard/jobs/${job.id}`}
                  key={job.id}
                  className="block p-4 transition border border-white/10 rounded-xl bg-white/3 hover:bg-white/5"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs text-gold">
                      {job.trackingCode}
                    </p>
                    <p className="mt-2 text-sm">{job.type}</p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
