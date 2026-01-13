import { auth } from "@/auth";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const DashboardHeader = async () => {
  const session = await auth();
  const userName = session?.user?.name?.split(" ")[0] || "User";
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs tracking-widest uppercase text-white/50">
          Dashboard
        </p>
        <h1 className="mt-8 text-3xl font-semibold">
          Welcome back, {userName}!
        </h1>
        <p className="mt-2 text-sm text-white/70">
          Manage requests, track deliveries, and view updates.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild className="text-black bg-gold hover:bg-gold/90">
          <Link href="/request">New Request</Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="text-white border-white/15 bg-white/3 hover:text-white/90 hover:bg-white/6"
        >
          <Link href="/tracking">Track Package</Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
