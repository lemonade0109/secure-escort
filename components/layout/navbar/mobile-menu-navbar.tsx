import Link from "next/link";
import React from "react";
import { Button } from "../../ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../../ui/sheet";

const MobileMenuNavbar = ({
  links,
  setOpen,
  open,
}: {
  links: { href: string; label: string }[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}) => {
  return (
    <React.Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            className="md:hidden inline-flex items-center justify-center "
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
            className="h-full bg-[#070a12] border-t border-white/10 md:hidden"
          >
            <SheetTitle className="px-4 py-4 text-lg font-semibold text-white">
              Menu
            </SheetTitle>

            <div className="flex flex-col text-white items-center mx-auto space-y-6 mt-10 w-full">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              <div className=" gap-3 flex flex-col mt-28 w-full px-4 ">
                <Button asChild variant="outline">
                  <Link
                    href="/sign-in"
                    className=""
                    onClick={() => setOpen(false)}
                  >
                    Sign In
                  </Link>
                </Button>

                <Link
                  href="/requests"
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
