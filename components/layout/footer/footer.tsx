import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const companyLinks = [
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
    { href: "/about", label: "About" },
  ];
  const supportLinks = [
    { href: "/tracking", label: "Track Delivery" },
    { href: "/sign-in", label: "Sign In" },
    { href: "/sign-up", label: "Create Account" },
  ];
  const legalLinks = [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms of service" },
  ];

  return (
    <section className="border-t border-white/10 bg-[#070a12] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className=" rounded-lg text-black grid place-items-center font-bold">
                <Image src="/logo.png" alt="Logo" width={50} height={50} />
              </div>

              <span className="font-semibold tracking-tight text-white">
                Secure Escort
              </span>
            </Link>

            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              Premium security escorts and protected deliveries with tracking,
              ETA updates, and professional guard assignment
            </p>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-semibold">Company</p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-sm font-semibold">Support</p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-sm font-semibold">Legal</p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/4 p-4">
              <p className="text-xs text-white/60">Need urgent support?</p>
              <p className="mt-1 text-sm font-medium text-gold">
                support@secureescort.com
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-white pt-8">
            <p className="text-xs text-white/60">
              &copy; {currentYear} Secure Escort. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
