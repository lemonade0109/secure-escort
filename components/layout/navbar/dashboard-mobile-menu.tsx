"use client";

import Link from "next/link";
import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { isAdminClient } from "@/lib/admin";
import { signOut, useSession } from "next-auth/react";

type DashboardMobileMenuProps = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

const DashboardMobileMenu = ({
  name,
  email,
  role,
}: DashboardMobileMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const { data: session } = useSession();
  const sessionUser = session?.user;
  const effectiveEmail = sessionUser?.email ?? email ?? null;
  const effectiveName = sessionUser?.name ?? name ?? null;
  const effectiveRole = sessionUser?.role ?? role ?? null;
  const isLoggedIn = !!sessionUser?.email;
  const userIsAdmin = isAdminClient(effectiveEmail);

  const links = [
    { href: "/profile", label: "Profile", show: isLoggedIn },
    {
      href: "/dashboard",
      label: "Dashboard",
      show: isLoggedIn && (userIsAdmin || effectiveRole === "GUARD"),
    },
    {
      href: "/guard/jobs",
      label: "My Jobs",
      show: isLoggedIn && effectiveRole === "GUARD",
    },
    {
      href: "/guard/availability",
      label: "Working Hours",
      show: isLoggedIn && effectiveRole === "GUARD",
    },
    { href: "/requests", label: "Requests", show: isLoggedIn },
    { href: "/tracking", label: "Tracking", show: true },
    {
      href: "/admin/analytics",
      label: "Analytics",
      show: isLoggedIn && userIsAdmin,
    },
    { href: "/admin/audit", label: "Audit Log", show: isLoggedIn && userIsAdmin },
    {
      href: "/admin/dashboard",
      label: "Admin Dashboard",
      show: isLoggedIn && userIsAdmin,
    },
    { href: "/admin/guards", label: "Guards", show: isLoggedIn && userIsAdmin },
  ];

  const handleSignOut = async () => {
    setOpen(false);
    await signOut({ callbackUrl: "/sign-in?signedOut=1" });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="md:hidden inline-flex items-center justify-center"
          variant="outline"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </SheetTrigger>

      {open && (
        <SheetContent
          side="right"
          className="h-full bg-[#070a12] border-l border-white/10 md:hidden"
        >
          <SheetTitle className="px-4 py-4 text-lg font-semibold text-white">
            Menu
          </SheetTitle>

          <div className="px-4 pb-4 text-white/80">
            <div className="text-sm font-medium text-white">
              {effectiveName || "Account"}
            </div>
            <div className="text-xs text-white/60 wrap-break-word">
              {effectiveEmail || ""}
            </div>
          </div>

          <div className="flex flex-col text-white items-start mx-auto space-y-4 mt-4 w-full px-4">
            {links
              .filter((link) => link.show)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-white/90"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

            <div className="mt-6 w-full space-y-3">
              <Link
                href="/request"
                className="rounded-md bg-[#D4A017] px-4 py-3 text-sm text-center font-medium text-black hover:opacity-90 w-full block"
                onClick={() => setOpen(false)}
              >
                Create New Request
              </Link>

              {isLoggedIn ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-white/15 text-white hover:text-white/90 hover:bg-white/10"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-white/15 text-white hover:text-white/90 hover:bg-white/10"
                >
                  <Link href="/sign-in" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      )}
    </Sheet>
  );
};

export default DashboardMobileMenu;
