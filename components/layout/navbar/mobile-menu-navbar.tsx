"use client";

import Link from "next/link";
import React from "react";
import { Button } from "../../ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../../ui/sheet";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const MobileMenuNavbar = ({
  links,
  setOpen,
  open,
}: {
  links: { href: string; label: string }[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}) => {
  const { data: session, status } = useSession();
  const isLoggedIn = !!session?.user?.email;
  const router = useRouter();

  const handleSignOut = async () => {
    setOpen(false);
    await signOut({ redirect: false });
    router.refresh();
    router.push("/?signedOut=1");
  };

  return (
    <React.Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            className="md:hidden inline-flex items-center justify-center"
            variant={"outline"}
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

            <div className="flex flex-col text-white items-center mx-auto space-y-6 mt-10 w-full">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-white/90"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="gap-3 flex flex-col mt-28 w-full px-4">
                {/* Auth button changes based on session */}
                {status === "loading" ? (
                  <Button variant="outline" disabled className="w-full">
                    ...
                  </Button>
                ) : isLoggedIn ? (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard" onClick={() => setOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/sign-in" onClick={() => setOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                )}

                {/* Primary CTA */}
                <Link
                  href="/request"
                  className="rounded-md bg-[#D4A017] px-4 py-3 text-sm text-center font-medium text-black hover:opacity-90 w-full"
                  onClick={() => setOpen(false)}
                >
                  Request a Guard
                </Link>
              </div>
            </div>
          </SheetContent>
        )}
      </Sheet>
    </React.Fragment>
  );
};

export default MobileMenuNavbar;
