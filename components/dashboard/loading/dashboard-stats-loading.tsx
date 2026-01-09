import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStatsProps } from "@/types";
import React from "react";

const DashboardStatsLoading: React.FC<DashboardStatsProps> = (props) => {
  const { total, active, completed } = props.stats;

  const items = [
    { label: "Total Requests", value: total },
    { label: "Active", value: active },
    { label: "Completed", value: completed },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((i) => (
        <Card
          key={i.label}
          className="
            relative overflow-hidden
            border border-white/10
            bg-white/5
            backdrop-blur-xl
            text-white
          "
        >
          {/* subtle top glow line */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />

          <CardHeader className="pb-1">
            <CardTitle className="text-xs uppercase tracking-widest text-white/60">
              <span className="block">
                <Skeleton className="h-4 w-24" />
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <span className="mt-2 text-3xl font-semibold text-gold block">
              <Skeleton className="h-8 w-32" />
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStatsLoading;
