import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";

export default async function DashboardHeader() {
  const session = await auth();
  const userName = session?.user?.name?.split(" ")[0] || "User";

  return (
    <Card className="overflow-hidden border-white/10 bg-white/5 text-white backdrop-blur-xl">
      {/* top chrome bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5">
            <ShieldCheck className="size-4 text-gold" />
          </div>
          <span className="text-sm font-medium tracking-tight">
            Secure Escort
          </span>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
        >
          <Bell className="size-4" />
        </button>
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

              <p className="mt-2 max-w-xl text-sm text-white/70">
                Manage your escort requests and track secured deliveries from
                one place.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="bg-gold text-black transition hover:bg-gold/90"
                >
                  <Link href="/request?type=escort">Request Escort</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white transition hover:bg-white/10 hover:text-white/90"
                >
                  <Link href="/request?type=delivery">Request Delivery</Link>
                </Button>
              </div>

              <div className="mt-6 h-px w-full max-w-xl bg-linear-to-r from-transparent via-white/15 to-transparent" />
            </div>
          </div>

          {/* RIGHT: security guards image */}
          <div className="relative hidden lg:block min-h-65">
            {/* Make the image fill the column */}
            <Image
              src="/dashboard-guard.png"
              alt="Professional security guards"
              fill
              priority
              className="object-cover object-top"
            />

            {/* overlays to blend with theme */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-y-0 left-0 w-2/3 bg-linear-to-r from-[#070A12] via-[#070A12]/60 to-transparent" />

            {/* subtle gold glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,160,23,0.18),transparent_55%)]" />

            {/* thin gold line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/60 to-transparent" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
