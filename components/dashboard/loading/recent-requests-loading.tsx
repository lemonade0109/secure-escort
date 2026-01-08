import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RecentRequestProps } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { statusVariant } from "../recent-requests";

const RecentRequestLoading = (props: { requests: RecentRequestProps[] }) => {
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
            <span className="text-sm block">
              <Skeleton className="h-4 w-32" />
            </span>

            <span className="mt-1 text-xs block">
              <Skeleton className="h-4 w-full" />
            </span>
          </div>
        ) : (
          props.requests.map((request) => (
            <Link
              key={request.id}
              href={`/request/${request.id}`}
              className="block rounded-xl border border-white/10 bg-white/3 p-4 hover:bg-white/5 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-sm font-medium block">
                    {request.type === "ESCORT"
                      ? "Escort Service"
                      : request.type === "DELIVERY"
                        ? "Delivery Service"
                        : "Personal Security"}
                    <Skeleton className="h-4 w-32" />
                  </span>
                  <span className="mt-1 text-xs block">
                    <Skeleton className="h-4 w-full" />
                  </span>
                  <span className="mt-1 text-xs  block">
                    <Skeleton className="h-4 w-48" />
                  </span>
                </div>
                <Badge variant={statusVariant(request.status)}>
                  <Skeleton className="h-4 w-24" />
                </Badge>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentRequestLoading;
