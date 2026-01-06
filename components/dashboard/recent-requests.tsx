import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

const RecentRequests = () => {
  return (
    <Card className="border-white/10 bg-white/4 text-white backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Requests</CardTitle>
        <Button
          asChild
          variant="outline"
          className="border-white/15 bg-white/3 text-white hover:text-white/90 hover:bg-white/6"
        >
          <Link href="/requests">Create</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/3 p-4">
          <p className="text-sm text-white/80">No requests yet.</p>
          <p className="mt-1 text-xs text-white/60">
            Your latest escort or delivery requests will show up here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentRequests;
