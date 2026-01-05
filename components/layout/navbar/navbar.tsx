"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../../ui/button";
import MobileMenuNavbar from "./mobile-menu-navbar";
import { APP_NAME } from "@/lib/constants";
import { useSession, signOut } from "next-auth/react";

const links = [
  { href: "/services", label: "Services" },
  { href: "/tracking", label: "Track Delivery" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
];

const Navbar = () => {
  const [open, setOpen] = React.useState(false);

  const { data: session, status } = useSession();
  const isLoggedIn = !!session?.user?.email;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070a12]/80 backdrop-blur ">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={80} height={40} />
            <span className="ml-1 font-semibold tracking-tight">
              {APP_NAME}
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-10">
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white hover:transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="space-x-3">
            {/* while session is loading, avoid flicker */}
            {status === "loading" ? (
              <Button
                variant="outline"
                className="text-gold border-white/15 bg-white/3"
                disabled
              >
                ...
              </Button>
            ) : isLoggedIn ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="text-gold hover:text-gold/80 hover:bg-accent-foreground/20 hover:transition-colors duration-300"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>

                <Button
                  variant="outline"
                  className="text-white/80 hover:text-white hover:bg-white/6 border-white/15"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                asChild
                variant="outline"
                className="text-gold hover:text-gold/80 hover:bg-accent-foreground/20 hover:transition-colors duration-300"
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <MobileMenuNavbar links={links} setOpen={setOpen} open={open} />
      </div>
    </header>
  );
};

export default Navbar;
