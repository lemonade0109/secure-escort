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
import { signOutAction } from "@/lib/actions/auth/signout";
import { useFormStatus } from "react-dom";

type DashboardMobileMenuProps = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

const SignOutButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="outline"
      className="w-full border-white/15 text-white hover:text-white/90 hover:bg-white/10"
      disabled={pending}
    >
      {pending ? "Signing out..." : "Sign Out"}
    </Button>
  );
};

const DashboardMobileMenu = ({
  name,
  email,
  role,
}: DashboardMobileMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const userIsAdmin = isAdminClient(email);

  const links = [
    { href: "/profile", label: "Profile", show: true },
    {
      href: "/dashboard",
      label: "Dashboard",
      show: userIsAdmin || role === "GUARD",
    },
    { href: "/guard/jobs", label: "My Jobs", show: role === "GUARD" },
    {
      href: "/guard/availability",
      label: "Working Hours",
      show: role === "GUARD",
    },
    { href: "/requests", label: "Requests", show: true },
    { href: "/tracking", label: "Tracking", show: true },
    { href: "/admin/analytics", label: "Analytics", show: userIsAdmin },
    { href: "/admin/audit", label: "Audit Log", show: userIsAdmin },
    { href: "/admin/dashboard", label: "Admin Dashboard", show: userIsAdmin },
    { href: "/admin/guards", label: "Guards", show: userIsAdmin },
  ];

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
              {name || "Account"}
            </div>
            <div className="text-xs text-white/60 wrap-break-word">
              {email || ""}
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

              <form action={signOutAction} className="w-full">
                <SignOutButton />
              </form>
            </div>
          </div>
        </SheetContent>
      )}
    </Sheet>
  );
};

export default DashboardMobileMenu;
