import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import UserMenu from "./user-menu";

export default async function DashboardHeader() {
  const session = await auth();
  const userName = session?.user?.name?.split(" ")[0] || "User";
  return (
    <Card className="overflow-hidden border-white/10 bg-white/4 text-white backdrop-blur-xl">
      {/* top chrome bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="inline-flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/3">
            <ShieldCheck className="size-4 text-gold" />
          </div>
          <span className="text-sm font-medium tracking-tight">
            Secure Escort
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/3 text-white/80 hover:bg-white/6"
          >
            <Bell className="size-4" />
          </button>

          <UserMenu name={session?.user?.name} email={session?.user?.email} />
        </div>
      </div>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT: text + actions */}
          <div className="relative p-6">
            {/* subtle glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 left-0 h-60 w-115 rounded-full bg-[radial-gradient(closest-side,rgba(212,160,23,0.18),transparent)] blur-2xl" />
            </div>

            <div className="relative z-10">
              <p className="text-xs uppercase tracking-widest text-white/50">
                Dashboard
              </p>

              <h1 className="mt-2 text-2xl sm:text-3xl font-semibold">
                Welcome back, <span className="text-white/90">{userName}!</span>
              </h1>

              <p className="mt-2 text-sm text-white/70 max-w-xl">
                Manage your escort requests and track secured deliveries from
                one place.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  className="bg-gold text-black hover:bg-gold/90 transition duration-300 "
                >
                  <Link href="/request">Request A Service</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-white/15 bg-white/3 text-white hover:text-white/90 hover:bg-white/6 transition duration-300"
                >
                  <Link href="/tracking">Track Your Package</Link>
                </Button>
              </div>

              <div className="mt-6 h-px w-full max-w-xl bg-linear-to-r from-transparent via-white/15 to-transparent" />
            </div>
          </div>

          {/* RIGHT: security guards image */}
          <div className="relative hidden lg:block min-h-65">
            <Image
              src="/dashboard-guard.png"
              alt="Professional security guards"
              fill
              priority
              className="object-cover object-top rounded-2xl px-2"
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
