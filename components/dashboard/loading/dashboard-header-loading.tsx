import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const DashboardHeaderLoading: React.FC = () => {
  return (
    <Card className="overflow-hidden border-white/10 bg-white/4 text-white backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/3 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/3">
            <Skeleton className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium tracking-tight block">
            <Skeleton className="h-4 w-24" />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/3">
            <Skeleton className="h-4 w-4" />
          </span>
          <span className="inline-flex items-center">
            <Skeleton className="h-8 w-24 rounded-full" />
          </span>
        </div>
      </div>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT: text + actions */}
          <div className="relative p-6">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 left-0 h-60 w-115 rounded-full bg-[radial-gradient(closest-side,rgba(212,160,23,0.18),transparent)] blur-2xl" />
            </div>
            <div className="relative z-10">
              <span className="text-xs uppercase tracking-widest text-white/50 block">
                <Skeleton className="h-4 w-20" />
              </span>
              <span className="mt-2 text-2xl sm:text-3xl font-semibold block">
                <Skeleton className="h-8 w-48" />
              </span>
              <span className="mt-2 text-sm text-white/70 max-w-xl block">
                <Skeleton className="h-4 w-64" />
              </span>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Skeleton className="h-10 w-40 rounded-md" />
                <Skeleton className="h-10 w-40 rounded-md" />
              </div>
              <div className="mt-6 h-px w-full max-w-xl bg-linear-to-r from-transparent via-white/15 to-transparent" />
            </div>
          </div>
          {/* RIGHT: image skeleton */}
          <div className="relative hidden lg:block min-h-65">
            <Skeleton className="absolute inset-0 w-full h-full rounded-2xl px-2" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(212,160,23,0.18),transparent_55%)]" />
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold/60 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-2/3 bg-linear-to-r from-[#070A12] via-[#070A12]/60 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_60%_0,rgba(212,160,23,0.18),transparent_70%)]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardHeaderLoading;
