import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import DashboardNav from "../layout/navbar/dashboard-nav";
import { getProfileAction } from "@/lib/actions/profile/get-profile";

export default async function DashboardHeader() {
  const { session } = await requireVerifiedUser();
  const userName = session?.user?.name?.split(" ")[0] || "User";

  const data = await getProfileAction();
  return (
    <Card className="overflow-hidden text-white border-white/10 bg-white/4 backdrop-blur-xl">
      {/* top chrome bar */}
      <DashboardNav
        email={data?.email}
        name={data?.name}
        image={data?.image}
        role={session?.user?.role}
      />

      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT: text + actions */}
          <div className="relative p-6">
            {/* subtle glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-24 left-0 h-60 w-115 rounded-full bg-[radial-gradient(closest-side,rgba(212,160,23,0.18),transparent)] blur-2xl" />
            </div>

            <div className="relative z-10">
              <p className="text-xs tracking-widest uppercase text-white/50">
                Dashboard
              </p>

              <h1 className="mt-2 text-xl sm:text-2xl md:text-3xl font-semibold">
                Welcome back, <span className="text-white/90">{userName}!</span>
              </h1>

              <p className="max-w-xl mt-2 text-sm sm:text-base text-white/70">
                Manage your escort requests and track secured deliveries from
                one place.
              </p>

              <div className="flex flex-col gap-3 mt-6 sm:flex-row">
                <Button
                  asChild
                  className="text-black transition duration-300 bg-gold hover:bg-gold/90 w-full sm:w-auto"
                >
                  <Link href="/request">Request A Service</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="text-white transition duration-300 border-white/15 bg-white/3 hover:text-white/90 hover:bg-white/6 w-full sm:w-auto"
                >
                  <Link href="/tracking">Track Your Package</Link>
                </Button>
              </div>

              <div className="w-full h-px max-w-xl mt-6 bg-linear-to-r from-transparent via-white/15 to-transparent" />
            </div>
          </div>

          {/* RIGHT: security guards image */}
          <div className="relative hidden lg:block min-h-65">
            <Image
              src="/dashboard-guard.png"
              alt="Professional security guards"
              fill
              priority
              className="object-cover object-top px-2 rounded-2xl"
              style={{ objectPosition: "center top" }}
            />

            {/* overlays to blend with theme */}

            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(212,160,23,0.18),transparent_55%)]" />
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold/60 to-transparent" />

            <div className="absolute inset-y-0 left-0 w-2/3 bg-linear-to-r from-[#070A12] via-[#070A12]/60 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_60%_0,rgba(212,160,23,0.18),transparent_70%)]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
