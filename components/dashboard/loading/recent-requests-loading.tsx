import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RecentRequestProps } from "@/types";
import { Button } from "@/components/ui/button";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const RecentRequestLoading: React.FC<{ requests: RecentRequestProps[] }> = (
  props
) => {
  return (
    <Card
      className="
        relative overflow-hidden
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        text-white
      "
    >
      {/* top glow divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />

      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm uppercase tracking-widest text-white/70">
          <Skeleton className="h-4 w-32" />
        </CardTitle>

        <Button
          asChild
          variant="outline"
          className="
            border-white/15
            bg-white/5
            text-white
            hover:text-white/90
            hover:bg-white/10
            transition duration-300
          "
        >
          <Skeleton className="h-8 w-24" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {props.requests.length === 0 ? (
          <div
            className="
            rounded-xl
            border border-white/10
            bg-white/3
            p-5
          "
          >
            <span className="text-sm text-white/80 block">
              <Skeleton className="h-4 w-32" />
            </span>

            <span className="mt-1 text-xs text-white/60 block">
              <Skeleton className="h-4 w-full" />
            </span>
          </div>
        ) : (
          Array.from({ length: props.requests.length }).map((_, idx) => (
            <div
              key={idx}
              className="block rounded-xl border border-white/10 bg-white/3 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-sm font-medium block">
                    <Skeleton className="h-4 w-32" />
                  </span>
                  <span className="mt-1 text-xs text-white/70 block">
                    <Skeleton className="h-4 w-full" />
                  </span>
                  <span className="mt-1 text-xs text-white/70 block">
                    <Skeleton className="h-4 w-48" />
                  </span>
                </div>
                <span>
                  <Skeleton className="h-4 w-24" />
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentRequestLoading;
