"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../../ui/button";
import MobileMenuNavbar from "./mobile-menu-navbar";

const links = [
  {
    href: "/services",
    label: "Services",
  },
  { href: "/tracking", label: "Track Delivery" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
];

const Navbar = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070a12]/80 backdrop-blur ">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <div className=" flex items-center">
            <Image
              src="/images/page-logo.png"
              alt="Logo"
              width={80}
              height={40}
            />
            <span className="ml-1 font-semibold tracking-tight">
              Secure Escort
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
                className="hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className=" space-x-3">
            <Button
              asChild
              variant="outline"
              className="text-gold hover:text-gold/80 hover:bg-accent-foreground/20"
            >
              <Link href="/sign-in" className="">
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile menu*/}
        <MobileMenuNavbar links={links} setOpen={setOpen} open={open} />
      </div>
    </header>
  );
};

export default Navbar;
