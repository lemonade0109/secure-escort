import React from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { InfoRow } from "@/lib/helpers-function";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

function roleBadge(role: string, userIsAdmin: boolean) {
  const r = String(role || "USER").toUpperCase();

  const label = userIsAdmin ? "Admin" : r === "GUARD" ? "Guard" : "User";

  return (
    <Badge className="border border-white/10 bg-white/4 text-white/80">
      {label}
    </Badge>
  );
}

function roleIcon(role: string, userIsAdmin: boolean) {
  const r = String(role || "USER").toUpperCase();

  if (userIsAdmin) return "👑";
  if (r === "GUARD") return "🛡️";
  return "👤";
}

const ProfileCard: React.FC<{
  name: string;
  email: string;
  role: string;
  userIsAdmin: boolean;
}> = ({ name, email, role, userIsAdmin }) => {
  const firstName = (name ?? "USER").trim().split(" ")[0].toUpperCase();
  const r = String(role || "USER").toUpperCase();

  const primaryLink = userIsAdmin
    ? "/admin/dashboard"
    : r === "GUARD"
      ? "/guard/jobs"
      : "/dashboard";

  return (
    <Card className="overflow-hidden text-white border-white/10 bg-white/4 backdrop-blur-xl">
      {/* top chrome */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/3">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center border rounded-lg size-8 border-white/10 bg-white/3">
            {roleIcon(role, userIsAdmin)}
          </div>
          <span className="text-sm font-medium tracking-tight">
            Account Profile
          </span>
        </div>
        {roleBadge(role, userIsAdmin)}
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="">
            <CardTitle className="text-xl sm:text-2xl">
              Welcome, <span className="text-white/90">{firstName}</span>
            </CardTitle>
            <p className="text-sm text-white/70">
              Keep your details accurate for smooth request handling and
              updates.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="text-white border-white/15 bg-white/3 hover:text-white/90 hover:bg-white/6"
          >
            <Link href="/profile/edit">Edit</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* subtle glow */}
        <div
          className={cn(
            "group relative overflow-hidden rounded-2xl p-6",
            "bg-linear-to-b from-white/8 to-black/40",
            "border border-white/10",
            "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]",
            "backdrop-blur-md",
            "overflow-hidden",
          )}
        >
          {/* glow  */}
          <div className="absolute w-56 h-56 rounded-full pointer-events-none -top-24 -left-24 bg-gold/20 blur-3xl" />

          {/* vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0, rgba(255,255,255,0.08), transparent_55%)]" />

          {/* edge highlight */}
          <div className="absolute inset-0 pointer-events-none ring-1 ring-white/10" />

          <div className="pointer-events-none absolute -top-24 left-0 h-60 w-115 rounded-full bg-[radial-gradient(closest-side, rgba(212, 160, 23, 0.18), transparent)] blur-2xl" />
          <div className="relative z-10 grid gap-4 sm:grid-cols-2">
            <InfoRow label="Full name" value={name} />
            <InfoRow label="Email address" value={email} mono />
            {userIsAdmin ? (
              <InfoRow label="Role" value="ADMIN" />
            ) : (
              <InfoRow label="Role" value={role} />
            )}
            <InfoRow
              label="Access"
              value={
                userIsAdmin
                  ? "Admin dashboard and operations"
                  : r === "GUARD"
                    ? "Guard job and availability"
                    : "User dashboard and requests"
              }
            />
          </div>
        </div>

        {/* quick actions */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Button asChild className="text-black bg-gold hover:bg-gold/90">
            <Link href={primaryLink}>
              Go to{" "}
              {userIsAdmin ? "Admin" : r === "GUARD" ? "Job" : "Dashboard"}
            </Link>
          </Button>

          {userIsAdmin ? (
            <Button
              asChild
              variant="outline"
              className="text-white border-white/15 bg-white/3 hover:text-white/90 hover:bg-white/6"
            >
              <Link href="/admin/requests">
                View Requests <ExternalLink className="ml-2 size-4" />
              </Link>
            </Button>
          ) : role === "GUARD" ? null : (
            <Button
              asChild
              variant="outline"
              className="text-white border-white/15 bg-white/3 hover:text-white/90 hover:bg-white/6"
            >
              <Link href="/requests">
                View Requests <ExternalLink className="ml-2 size-4" />
              </Link>
            </Button>
          )}
        </div>

        <div className="w-full h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
